#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { searchCommand } from './commands/search.js';
import { downloadCommand } from './commands/download.js';
import { statusCommand } from './commands/status.js';
import { cancelCommand } from './commands/cancel.js';
import { configCommand } from './commands/config.js';
import { releasesCommand } from './commands/releases.js';
import { setupCommand, showShelfmarkConfig } from './commands/setup.js';
import { BANNER } from './utils/output.js';

const program = new Command();

program
  .name('shelfmark')
  .description('A beautiful CLI for the Shelfmark book/audiobook downloader')
  .version('1.0.0')
  .addHelpText('beforeAll', BANNER);

program
  .command('setup')
  .description('Configure Shelfmark server settings (qBittorrent, download paths)')
  .option('--qbittorrent-host <url>', 'qBittorrent Web UI URL (e.g. http://localhost:8090)')
  .option('--qbittorrent-user <user>', 'qBittorrent username')
  .option('--qbittorrent-password <password>', 'qBittorrent password')
  .option('--download-dir <path>', 'Download directory path')
  .option('--show', 'Show current Shelfmark configuration')
  .action((options) => {
    if (options.show) {
      showShelfmarkConfig();
    } else {
      setupCommand(options);
    }
  });

program
  .command('search <query>')
  .description('Search for books or audiobooks')
  .option('-a, --audiobook', 'Search for audiobooks only (m4b, mp3)')
  .option('-e, --ebook', 'Search for ebooks only (epub, mobi, pdf)')
  .option('-f, --format <format>', 'Filter by format (epub, mobi, m4b, mp3, pdf)')
  .option('-l, --limit <number>', 'Limit number of results', parseInt)
  .action(searchCommand);

program
  .command('download <id>')
  .description('Download a book by ID')
  .option('-e, --ebook', 'Download ebook format (epub, mobi, pdf)')
  .option('-a, --audiobook', 'Download audiobook format (m4b, mp3)')
  .option('-f, --format <format>', 'Specific format (epub, mobi, pdf, m4b, mp3)')
  .option('-r, --release <releaseId>', 'Specify a specific release')
  .option('-w, --watch', 'Watch download progress')
  .action(downloadCommand);

program
  .command('status')
  .description('Show download status and queue')
  .action(statusCommand);

program
  .command('cancel <id>')
  .description('Cancel a download')
  .action(cancelCommand);

program
  .command('config <action> [key] [value]')
  .description('Manage configuration (set, get, list, reset)')
  .action(configCommand);

program
  .command('releases <id>')
  .description('Show available releases for a book')
  .action(releasesCommand);

program.parse();
