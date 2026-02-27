import ora from 'ora';
import chalk from 'chalk';
import { ShelfmarkAPI } from '../api.js';
import { displayError, displayInfo, formatBadge } from '../utils/output.js';
import { formatSpeed } from '../utils/progress.js';
import { config } from '../config.js';

interface DownloadOptions {
  release?: string;
  watch?: boolean;
  ebook?: boolean;
  audiobook?: boolean;
  format?: string;
}

export async function downloadCommand(id: string, options: DownloadOptions): Promise<void> {
  const api = new ShelfmarkAPI(config);
  
  // Show warning about format selection
  if (options.audiobook || options.ebook || options.format) {
    console.log();
    console.log(chalk.yellow('⚠ Note: Format selection requires using the Shelfmark web UI to pick releases.'));
    console.log(chalk.gray('  The CLI will queue the download, but format selection happens in the browser.'));
    console.log();
    console.log(chalk.gray('  For audiobooks: Open http://localhost:8084 → Search → Get → Pick audiobook release'));
    console.log();
  }
  
  const spinner = ora('Starting download...').start();
  
  try {
    const response = await api.download(id);
    spinner.succeed(chalk.green('Download queued'));
    
    console.log();
    console.log(chalk.bold('  ID: ') + chalk.cyan(id));
    console.log();
    
    if (options.watch) {
      await watchDownload(api, id);
    } else {
      displayInfo('Use "shelfmark status" to check download progress');
      console.log();
    }
    
  } catch (error) {
    spinner.stop();
    displayError(error instanceof Error ? error.message : 'Download failed');
    process.exit(1);
  }
}

async function watchDownload(api: ShelfmarkAPI, downloadId: string): Promise<void> {
  const spinner = ora('Watching download progress...').start();
  
  let attempts = 0;
  const maxAttempts = 300;
  
  while (attempts < maxAttempts) {
    try {
      const status = await api.status();
      
      const allDownloads = [
        ...Object.values(status.downloading || {}),
        ...Object.values(status.queued || {}),
        ...Object.values(status.locating || {}),
        ...Object.values(status.resolving || {}),
        ...Object.values(status.complete || {}),
        ...Object.values(status.done || {}),
        ...Object.values(status.available || {}),
        ...Object.values(status.error || {}),
      ];
      
      const download = allDownloads.find(d => d.id === downloadId);
      
      if (!download) {
        attempts++;
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      
      if (download.status === 'completed' || download.status === 'complete' || download.status === 'done') {
        spinner.succeed(chalk.green('Download completed!'));
        console.log();
        console.log(chalk.bold('  ') + chalk.green(download.title));
        console.log();
        return;
      }
      
      if (download.status === 'error') {
        spinner.fail(chalk.red('Download failed'));
        displayError(download.error || 'Unknown error');
        process.exit(1);
      }
      
      if (download.status === 'downloading') {
        const progress = download.progress || 0;
        const speed = download.speed || formatSpeed(0);
        spinner.text = `Downloading: ${progress}% | ${speed} | ${download.title?.substring(0, 30) || 'Unknown'}`;
      } else if (download.status === 'queued') {
        spinner.text = `Queued: ${download.title?.substring(0, 40) || 'Waiting...'}`;
      } else {
        spinner.text = `${download.status}: ${download.title?.substring(0, 40) || 'Processing...'}`;
      }
      
      attempts++;
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (error) {
      spinner.stop();
      displayError(error instanceof Error ? error.message : 'Status check failed');
      process.exit(1);
    }
  }
  
  spinner.stop();
  displayError('Download watch timed out');
  process.exit(1);
}
