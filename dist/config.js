import Conf from 'conf';
import chalk from 'chalk';
const defaults = {
    url: 'http://localhost:8084',
    format: 'epub',
    limit: 10,
};
export const config = new Conf({
    projectName: 'shelfmark-cli',
    defaults,
});
export function getConfig(key) {
    return config.get(key);
}
export function setConfig(key, value) {
    config.set(key, value);
}
export function getAllConfig() {
    return {
        url: config.get('url'),
        format: config.get('format'),
        limit: config.get('limit'),
    };
}
export function isConfigured() {
    return config.has('url');
}
export function showConfig() {
    const allConfig = getAllConfig();
    console.log(chalk.bold('\nCurrent Configuration:\n'));
    console.log(`  ${chalk.cyan('URL:')}    ${allConfig.url}`);
    console.log(`  ${chalk.cyan('Format:')} ${allConfig.format || 'not set'}`);
    console.log(`  ${chalk.cyan('Limit:')}  ${allConfig.limit || 'not set'}`);
    console.log();
    console.log(chalk.gray(`Config file: ${config.path}`));
    console.log();
}
export function resetConfig() {
    config.clear();
    config.set(defaults);
}
//# sourceMappingURL=config.js.map