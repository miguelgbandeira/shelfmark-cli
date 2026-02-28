import chalk from 'chalk';
import Table from 'cli-table3';
export function formatBytes(sizeStr) {
    // If it's already a formatted string like "4.6MB", just return it
    if (typeof sizeStr === 'string' && /[KMGT]?B$/i.test(sizeStr)) {
        return sizeStr;
    }
    const size = typeof sizeStr === 'string' ? parseFloat(sizeStr) : sizeStr;
    if (isNaN(size) || size === 0)
        return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
export function formatBadge(format) {
    const f = format.toLowerCase();
    if (f === 'epub')
        return chalk.blue.bold(` ${format.toUpperCase()} `);
    if (f === 'mobi')
        return chalk.green.bold(` ${format.toUpperCase()} `);
    if (f === 'm4b')
        return chalk.magenta.bold(` ${format.toUpperCase()} `);
    if (f === 'mp3')
        return chalk.cyan.bold(` ${format.toUpperCase()} `);
    if (f === 'pdf')
        return chalk.red.bold(` ${format.toUpperCase()} `);
    if (f === 'azw3')
        return chalk.yellow.bold(` ${format.toUpperCase()} `);
    return chalk.white.bold(` ${format.toUpperCase()} `);
}
export function displaySearchResults(results, total) {
    if (results.length === 0) {
        console.log(chalk.yellow('\nNo results found.\n'));
        return;
    }
    const table = new Table({
        head: [
            chalk.gray('#'),
            chalk.cyan.bold('Title'),
            chalk.cyan.bold('Author'),
            chalk.cyan.bold('Format'),
            chalk.cyan.bold('Size'),
            chalk.cyan.bold('Year'),
            chalk.cyan.bold('ID'),
        ],
        colWidths: [4, 35, 20, 10, 12, 6, 34],
        wordWrap: true,
        style: {
            head: [],
            border: ['gray'],
        },
    });
    results.forEach((result, index) => {
        table.push([
            chalk.gray(index + 1),
            chalk.white(result.title.substring(0, 33)),
            chalk.gray(result.author.substring(0, 18)),
            formatBadge(result.format),
            chalk.white(formatBytes(result.size)),
            chalk.gray(result.year || '-'),
            chalk.cyan(result.id),
        ]);
    });
    console.log();
    console.log(table.toString());
    console.log();
    if (total !== undefined) {
        console.log(chalk.gray(`  Showing ${results.length} of ${total} results`));
    }
    else {
        console.log(chalk.gray(`  ${results.length} results`));
    }
    console.log();
}
export function displayReleases(releases) {
    if (releases.length === 0) {
        console.log(chalk.yellow('\nNo releases available.\n'));
        return;
    }
    const table = new Table({
        head: [
            chalk.gray('#'),
            chalk.cyan.bold('Title/Quality'),
            chalk.cyan.bold('Format'),
            chalk.cyan.bold('Size'),
            chalk.cyan.bold('Source'),
            chalk.gray('ID'),
        ],
        colWidths: [4, 45, 10, 12, 15, 15],
        wordWrap: true,
        style: {
            head: [],
            border: ['gray'],
        },
    });
    releases.forEach((release, index) => {
        table.push([
            chalk.gray(index + 1),
            chalk.white(release.title.substring(0, 43)),
            formatBadge(release.format),
            chalk.white(formatBytes(release.size)),
            chalk.gray(release.source.substring(0, 13)),
            chalk.dim(release.id),
        ]);
    });
    console.log();
    console.log(table.toString());
    console.log();
    console.log(chalk.gray(`  ${releases.length} releases available`));
    console.log();
}
export function displayError(message) {
    console.log();
    console.log(chalk.red.bold(' Error: ') + chalk.red(message));
    console.log();
}
export function displaySuccess(message) {
    console.log();
    console.log(chalk.green.bold(' ✓ ') + chalk.green(message));
    console.log();
}
export function displayInfo(message) {
    console.log(chalk.cyan(' ℹ ') + message);
}
export function displayWarning(message) {
    console.log(chalk.yellow(' ⚠ ') + chalk.yellow(message));
}
export const BANNER = `
${chalk.cyan.bold('   _____ _    _ _____  _____ _____ _____ _      ______ ______ ')}
${chalk.cyan.bold('  / ____| |  | |  __ \\|  __ \\_   _|_   _| |    |  ____|  ____|')}
${chalk.cyan.bold(' | (___| |__| | |__) | |  | || |   | | | |    | |__  | |__   ')}
${chalk.cyan.bold('  \\___ \\|  __  |  ___/| |  | || |   | | | |    |  __| |  __|  ')}
${chalk.cyan.bold('  ____) | |  | | |    | |__| || |_ _| |_| |____| |____| |____ ')}
${chalk.cyan.bold(' |_____/|_|  |_|_|    |_____/ |__|_____|______|______|______|')}
${chalk.dim('                                                              CLI v1.0.0')}
${chalk.gray('  A beautiful CLI for the Shelfmark book/audiobook downloader')}
${chalk.gray('  ─────────────────────────────────────────────────────────────')}
`;
//# sourceMappingURL=output.js.map