import ora from 'ora';
import chalk from 'chalk';
import { ShelfmarkAPI } from '../api.js';
import { displayError, displaySuccess } from '../utils/output.js';
import { config } from '../config.js';

export async function cancelCommand(id: string): Promise<void> {
  const spinner = ora(`Cancelling download ${id}...`).start();
  
  try {
    const api = new ShelfmarkAPI(config);
    const response = await api.cancel(id);
    spinner.stop();
    
    if (response.success) {
      displaySuccess(`Download ${id} cancelled`);
    } else {
      displayError(response.message || 'Failed to cancel download');
      process.exit(1);
    }
    
  } catch (error) {
    spinner.stop();
    displayError(error instanceof Error ? error.message : 'Cancel failed');
    process.exit(1);
  }
}
