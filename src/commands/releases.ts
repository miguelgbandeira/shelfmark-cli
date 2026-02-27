import ora from 'ora';
import chalk from 'chalk';
import { ShelfmarkAPI } from '../api.js';
import { displayReleases, displayError } from '../utils/output.js';
import { config } from '../config.js';

export async function releasesCommand(id: string): Promise<void> {
  const spinner = ora('Fetching releases...').start();
  
  try {
    const api = new ShelfmarkAPI(config);
    const response = await api.releases(id);
    spinner.stop();
    
    console.log(chalk.bold(`\nAvailable releases for ID: ${chalk.cyan(id)}`));
    displayReleases(response.releases || []);
    
  } catch (error) {
    spinner.stop();
    displayError(error instanceof Error ? error.message : 'Failed to fetch releases');
    process.exit(1);
  }
}
