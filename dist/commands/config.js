import chalk from 'chalk';
import { getConfig, setConfig, showConfig, resetConfig } from '../config.js';
import { displayError, displaySuccess } from '../utils/output.js';
export function configCommand(action, key, value) {
    try {
        switch (action) {
            case 'set':
                if (!key || !value) {
                    displayError('Usage: shelfmark config set <key> <value>');
                    process.exit(1);
                }
                setConfig(key, value);
                displaySuccess(`Set ${key} = ${value}`);
                break;
            case 'get':
                if (!key) {
                    displayError('Usage: shelfmark config get <key>');
                    process.exit(1);
                }
                const val = getConfig(key);
                console.log();
                console.log(`  ${chalk.cyan(key)}: ${val}`);
                console.log();
                break;
            case 'list':
                showConfig();
                break;
            case 'reset':
                resetConfig();
                displaySuccess('Configuration reset to defaults');
                break;
            default:
                displayError(`Unknown action: ${action}`);
                console.log(chalk.gray('\n  Available actions: set, get, list, reset\n'));
                process.exit(1);
        }
    }
    catch (error) {
        displayError(error instanceof Error ? error.message : 'Config operation failed');
        process.exit(1);
    }
}
//# sourceMappingURL=config.js.map