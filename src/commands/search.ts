import ora from 'ora';
import chalk from 'chalk';
import { ShelfmarkAPI } from '../api.js';
import { displaySearchResults, displayError } from '../utils/output.js';
import { getConfig, config } from '../config.js';

interface SearchOptions {
  audiobook?: boolean;
  format?: string;
  limit?: number;
}

export async function searchCommand(query: string, options: SearchOptions): Promise<void> {
  const spinner = ora('Searching...').start();
  
  try {
    const api = new ShelfmarkAPI(config);
    const mode = options.audiobook ? 'audiobook' : undefined;
    
    const results = await api.search(query, mode);
    spinner.stop();
    
    let filteredResults = results;
    
    if (options.format) {
      filteredResults = results.filter(r => 
        r.format.toLowerCase() === options.format!.toLowerCase()
      );
    }
    
    const limit = options.limit || getConfig('limit') || 10;
    const limitedResults = filteredResults.slice(0, limit);
    
    console.log(chalk.bold(`\nSearch results for "${chalk.cyan(query)}"`));
    if (options.audiobook) {
      console.log(chalk.gray('Filter: Audiobooks only'));
    }
    if (options.format) {
      console.log(chalk.gray(`Format: ${options.format.toUpperCase()}`));
    }
    
    displaySearchResults(limitedResults, filteredResults.length);
    
  } catch (error) {
    spinner.stop();
    displayError(error instanceof Error ? error.message : 'Search failed');
    process.exit(1);
  }
}
