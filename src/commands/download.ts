import ora from 'ora';
import chalk from 'chalk';
import { ShelfmarkAPI } from '../api.js';
import { displayError, displaySuccess, displayInfo } from '../utils/output.js';
import { displayDownloadStatus, formatSpeed } from '../utils/progress.js';
import { config } from '../config.js';

interface DownloadOptions {
  release?: string;
  watch?: boolean;
}

export async function downloadCommand(id: string, options: DownloadOptions): Promise<void> {
  const api = new ShelfmarkAPI(config);
  
  const spinner = ora('Starting download...').start();
  
  try {
    const response = await api.download(id);
    spinner.succeed(chalk.green('Download queued'));
    
    console.log();
    console.log(chalk.bold('  Title: ') + response.message);
    console.log(chalk.gray('  ID: ') + id);
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
  
  let lastProgress = 0;
  let attempts = 0;
  const maxAttempts = 300;
  
  while (attempts < maxAttempts) {
    try {
      const status = await api.status();
      
      const download = [...status.active, ...status.queued, ...status.completed, ...status.error]
        .find(d => d.id === downloadId);
      
      if (!download) {
        attempts++;
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      
      if (download.status === 'completed') {
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
        spinner.text = `Downloading: ${progress}% | ${speed} | ${download.title.substring(0, 30)}`;
        lastProgress = progress;
      } else if (download.status === 'queued') {
        spinner.text = `Queued: ${download.title.substring(0, 40)}`;
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
