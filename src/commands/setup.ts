import chalk from 'chalk';
import Conf from 'conf';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { displayError, displaySuccess, displayInfo } from '../utils/output.js';

export interface ShelfmarkConfig {
  QBITTORRENT_HOST?: string;
  QBITTORRENT_USER?: string;
  QBITTORRENT_PASSWORD?: string;
  DOWNLOAD_DIR?: string;
  INGEST_DIR?: string;
  SEARCH_MODE?: string;
  SUPPORTED_FORMATS?: string[];
  SUPPORTED_AUDIOBOOK_FORMATS?: string[];
  BOOK_LANGUAGE?: string[];
}

interface SetupOptions {
  qbittorrentHost?: string;
  qbittorrentUser?: string;
  qbittorrentPassword?: string;
  downloadDir?: string;
  ingestDir?: string;
}

// Common Shelfmark config locations
const SHELFMARK_CONFIG_PATHS = [
  './config/settings.json',  // Default Docker location
  path.join(os.homedir(), 'docker-services/shelfmark/config/settings.json'),
  path.join(os.homedir(), 'shelfmark/config/settings.json'),
  path.join(os.homedir(), '.config/shelfmark/settings.json'),
  '/config/settings.json',  // Inside Docker container
];

function findShelfmarkConfig(): string | null {
  for (const configPath of SHELFMARK_CONFIG_PATHS) {
    const expandedPath = configPath.replace('~', os.homedir());
    if (fs.existsSync(expandedPath)) {
      return expandedPath;
    }
  }
  return null;
}

function readShelfmarkConfig(configPath: string): ShelfmarkConfig {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

function writeShelfmarkConfig(configPath: string, config: ShelfmarkConfig): void {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export async function setupCommand(options: SetupOptions): Promise<void> {
  console.log();
  console.log(chalk.bold('🛠️  Shelfmark CLI Setup'));
  console.log();
  
  // Find Shelfmark config
  let configPath = findShelfmarkConfig();
  
  if (!configPath) {
    displayInfo('No existing Shelfmark config found.');
    console.log(chalk.gray('Please specify the path to your Shelfmark config directory:'));
    console.log(chalk.gray('Example: ~/docker-services/shelfmark/config'));
    console.log();
    
    // Try to detect from common Docker locations
    const possiblePaths = [
      path.join(os.homedir(), 'docker-services/shelfmark/config/settings.json'),
      path.join(os.homedir(), 'shelfmark/config/settings.json'),
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        configPath = p;
        displayInfo(`Found config at: ${p}`);
        break;
      }
    }
    
    if (!configPath) {
      displayError('Could not find Shelfmark config. Please run:');
      console.log();
      console.log(chalk.cyan('  shelfmark setup --config-path /path/to/shelfmark/config'));
      console.log();
      process.exit(1);
    }
  }
  
  displayInfo(`Using config: ${configPath}`);
  console.log();
  
  // Read current config
  let config = readShelfmarkConfig(configPath);
  
  // Update with provided options
  const updates: string[] = [];
  
  if (options.qbittorrentHost) {
    config.QBITTORRENT_HOST = options.qbittorrentHost;
    updates.push(`qBittorrent Host: ${options.qbittorrentHost}`);
  }
  
  if (options.qbittorrentUser) {
    config.QBITTORRENT_USER = options.qbittorrentUser;
    updates.push(`qBittorrent User: ${options.qbittorrentUser}`);
  }
  
  if (options.qbittorrentPassword) {
    config.QBITTORRENT_PASSWORD = options.qbittorrentPassword;
    updates.push('qBittorrent Password: ********');
  }
  
  if (options.downloadDir) {
    config.DOWNLOAD_DIR = options.downloadDir;
    config.INGEST_DIR = options.downloadDir;
    updates.push(`Download Directory: ${options.downloadDir}`);
  }
  
  if (updates.length === 0) {
    displayError('No settings provided. Use:');
    console.log();
    console.log(chalk.gray('  shelfmark setup --qbittorrent-host http://localhost:8090 \\'));
    console.log(chalk.gray('                   --qbittorrent-user admin \\'));
    console.log(chalk.gray('                   --qbittorrent-password yourpassword \\'));
    console.log(chalk.gray('                   --download-dir /downloads'));
    console.log();
    process.exit(1);
  }
  
  // Write updated config
  writeShelfmarkConfig(configPath, config);
  
  console.log(chalk.bold('Updated settings:'));
  updates.forEach(u => console.log(`  ${chalk.green('✓')} ${u}`));
  console.log();
  
  displaySuccess('Shelfmark configuration updated!');
  console.log(chalk.gray('Restart Shelfmark for changes to take effect.'));
  console.log();
}

export function showShelfmarkConfig(): void {
  const configPath = findShelfmarkConfig();
  
  if (!configPath) {
    displayError('No Shelfmark config found. Run "shelfmark setup" first.');
    return;
  }
  
  const config = readShelfmarkConfig(configPath);
  
  console.log(chalk.bold('\nShelfmark Configuration:\n'));
  console.log(chalk.gray(`Config file: ${configPath}\n`));
  
  if (config.QBITTORRENT_HOST) {
    console.log(`  ${chalk.cyan('qBittorrent Host:')} ${config.QBITTORRENT_HOST}`);
  }
  if (config.QBITTORRENT_USER) {
    console.log(`  ${chalk.cyan('qBittorrent User:')} ${config.QBITTORRENT_USER}`);
  }
  if (config.QBITTORRENT_PASSWORD) {
    console.log(`  ${chalk.cyan('qBittorrent Password:')} ********`);
  }
  if (config.DOWNLOAD_DIR || config.INGEST_DIR) {
    console.log(`  ${chalk.cyan('Download Directory:')} ${config.DOWNLOAD_DIR || config.INGEST_DIR}`);
  }
  if (config.SEARCH_MODE) {
    console.log(`  ${chalk.cyan('Search Mode:')} ${config.SEARCH_MODE}`);
  }
  if (config.BOOK_LANGUAGE) {
    console.log(`  ${chalk.cyan('Languages:')} ${config.BOOK_LANGUAGE.join(', ')}`);
  }
  console.log();
}
