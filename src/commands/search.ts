import ora from 'ora';
import chalk from 'chalk';
import { ShelfmarkAPI } from '../api.js';
import { displaySearchResults, displayError } from '../utils/output.js';
import { config } from '../config.js';

interface SearchOptions {
  audiobook?: boolean;
  ebook?: boolean;
  format?: string;
  limit?: number;
}

const AUDIOBOOK_FORMATS = ['m4b', 'mp3'];
const EBOOK_FORMATS = ['epub', 'mobi', 'pdf', 'azw3'];

export async function searchCommand(query: string, options: SearchOptions): Promise<void> {
  const spinner = ora('Searching...').start();
  
  try {
    const api = new ShelfmarkAPI(config);
    const mode = options.audiobook ? 'audiobook' : undefined;
    const results = await api.search(query, mode);
    
    spinner.stop();
    
    let filteredResults = results;
    
    // Note: Shelfmark search results show ebooks. Audiobooks are found via "Get releases" in the UI.
    if (options.audiobook) {
      filteredResults = filteredResults.filter(r => 
        AUDIOBOOK_FORMATS.includes(r.format?.toLowerCase() || '')
      );
      
      if (filteredResults.length === 0) {
        console.log();
        console.log(chalk.yellow('No audiobooks found in search results.'));
        console.log();
        console.log(chalk.gray('💡 Audiobooks are fetched from AudiobookBay when you click "Get" in the web UI.'));
        console.log(chalk.gray('   Open http://localhost:8084 → Search → Click "Get" → Pick audiobook release'));
        console.log();
        return;
      }
    }
    
    if (options.ebook) {
      filteredResults = filteredResults.filter(r => 
        EBOOK_FORMATS.includes(r.format?.toLowerCase() || '')
      );
    }
    
    if (options.format) {
      filteredResults = filteredResults.filter(r => 
        r.format?.toLowerCase() === options.format!.toLowerCase()
      );
    }
    
    const limit = options.limit || 10;
    const limitedResults = filteredResults.slice(0, limit);
    
    console.log(chalk.bold(`\nSearch results for "${chalk.cyan(query)}"`));
    if (options.audiobook) {
      console.log(chalk.gray('Filter: Audiobooks only (m4b, mp3)'));
    }
    if (options.ebook) {
      console.log(chalk.gray('Filter: Ebooks only (epub, mobi, pdf, azw3)'));
    }
    if (options.format) {
      console.log(chalk.gray(`Format: ${options.format.toUpperCase()}`));
    }
    
    if (limitedResults.length === 0) {
      console.log();
      console.log(chalk.gray('No results found.'));
      console.log();
      return;
    }
    
    displaySearchResults(limitedResults);
    
    if (filteredResults.length > limit) {
      console.log(chalk.gray(`\n  Showing ${limit} of ${filteredResults.length} results`));
      console.log(chalk.gray(`  Use --limit ${filteredResults.length} to see all results`));
    } else {
      console.log(chalk.gray(`\n  Showing ${limitedResults.length} results`));
    }
    console.log();
    
  } catch (error) {
    spinner.stop();
    displayError(error instanceof Error ? error.message : 'Search failed');
    process.exit(1);
  }
}
