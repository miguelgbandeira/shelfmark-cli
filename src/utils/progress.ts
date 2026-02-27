import cliProgress from 'cli-progress';
import chalk from 'chalk';
import { DownloadStatus, StatusResponse } from '../api.js';

export function createDownloadProgress(): cliProgress.MultiBar {
  return new cliProgress.MultiBar({
    format: `  {bar} {percentage}% | {title} | {speed}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    barsize: 30,
  });
}

export function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond === 0) return '0 B/s';
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(1024));
  return `${(bytesPerSecond / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function formatEta(seconds: number): string {
  if (seconds < 0 || !isFinite(seconds)) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function displayDownloadStatus(status: DownloadStatus): void {
  const statusColors: Record<string, (text: string) => string> = {
    queued: chalk.yellow,
    downloading: chalk.cyan,
    completed: chalk.green,
    error: chalk.red,
  };

  const color = statusColors[status.status] || chalk.white;
  const progressBar = status.status === 'downloading' 
    ? `[${'█'.repeat(Math.floor(status.progress / 5))}${'░'.repeat(20 - Math.floor(status.progress / 5))}] ${status.progress}%`
    : '';

  console.log(
    `  ${color(status.status.padEnd(12))} ${chalk.white(status.title.substring(0, 40))} ${progressBar}`
  );
  
  if (status.error) {
    console.log(`    ${chalk.red('Error:')} ${status.error}`);
  }
}

function objectToArray(obj: Record<string, DownloadStatus>): DownloadStatus[] {
  return Object.values(obj || {});
}

export function displayStatusReport(response: StatusResponse): void {
  const active = objectToArray(response.downloading);
  const queued = [...objectToArray(response.queued), ...objectToArray(response.locating), ...objectToArray(response.resolving)];
  const completed = [...objectToArray(response.complete), ...objectToArray(response.done), ...objectToArray(response.available)];
  const errors = objectToArray(response.error);

  if (active.length === 0 && queued.length === 0 && completed.length === 0 && errors.length === 0) {
    console.log(chalk.gray('\n  No downloads in queue.\n'));
    return;
  }

  console.log();

  if (active.length > 0) {
    console.log(chalk.cyan.bold('  Active Downloads:\n'));
    const bar = createDownloadProgress();
    
    active.forEach((download) => {
      bar.create(100, download.progress || 0, {
        title: (download.title || 'Unknown').substring(0, 25),
        speed: download.speed || formatSpeed(0),
      });
    });
    
    bar.stop();
    console.log();
  }

  if (queued.length > 0) {
    console.log(chalk.yellow.bold('  Queued:\n'));
    queued.forEach((item, i) => {
      console.log(`    ${chalk.gray(i + 1)}. ${item.title || 'Unknown'}`);
    });
    console.log();
  }

  if (completed.length > 0) {
    console.log(chalk.green.bold('  Completed:\n'));
    completed.slice(-5).forEach((item, i) => {
      console.log(`    ${chalk.gray(i + 1)}. ${chalk.green('✓')} ${item.title || 'Unknown'}`);
    });
    if (completed.length > 5) {
      console.log(chalk.gray(`    ... and ${completed.length - 5} more`));
    }
    console.log();
  }

  if (errors.length > 0) {
    console.log(chalk.red.bold('  Errors:\n'));
    errors.slice(-5).forEach((item, i) => {
      console.log(`    ${chalk.gray(i + 1)}. ${chalk.red('✗')} ${item.title || 'Unknown'}`);
      if (item.error) {
        console.log(chalk.gray(`       ${item.error}`));
      }
    });
    if (errors.length > 5) {
      console.log(chalk.gray(`    ... and ${errors.length - 5} more`));
    }
    console.log();
  }
}
