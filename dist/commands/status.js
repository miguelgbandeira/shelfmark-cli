import ora from 'ora';
import { ShelfmarkAPI } from '../api.js';
import { displayError } from '../utils/output.js';
import { displayStatusReport } from '../utils/progress.js';
import { config } from '../config.js';
export async function statusCommand() {
    const spinner = ora('Fetching download status...').start();
    try {
        const api = new ShelfmarkAPI(config);
        const status = await api.status();
        spinner.stop();
        displayStatusReport(status);
    }
    catch (error) {
        spinner.stop();
        displayError(error instanceof Error ? error.message : 'Failed to fetch status');
        process.exit(1);
    }
}
//# sourceMappingURL=status.js.map