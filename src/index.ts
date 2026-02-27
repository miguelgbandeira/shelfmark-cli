#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { searchCommand } from './commands/search.js';
import { downloadCommand } from './commands/download.js';
import { statusCommand } from './commands/status.js';
import { cancelCommand } from './commands/cancel.js';
import { configCommand } from './commands/config.js';
import { releasesCommand } from './commands/releases.js';
import { BANNER } from './utils/output.js';

const program = new Command();

program
  .name('shelfmark')
  .description('A beautiful CLI for the Shelfmark book/audiobook downloader')
  .version('1.0.0')
  .addHelpText('beforeAll', BANNER);

program
  .command('search <query>')
  .description('Search for books or audiobooks')
  .option('-a, --audiobook', 'Search for audiobooks only')
  .option('-f, --format <format>', 'Filter by format (epub, mobi, m4b, pdf)')
  .option('-l, --limit <number>', 'Limit number of results', parseInt)
  .action(searchCommand);

program
  .command('download <id>')
  .description('Download a book by ID')
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
