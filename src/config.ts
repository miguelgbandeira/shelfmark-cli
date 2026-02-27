import Conf from 'conf';
import chalk from 'chalk';

export interface AppConfig {
  url: string;
  format?: string;
  limit?: number;
}

const defaults: AppConfig = {
  url: 'http://localhost:8084',
  format: 'epub',
  limit: 10,
};

export const config = new Conf<AppConfig>({
  projectName: 'shelfmark-cli',
  defaults,
});

export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return config.get(key);
}

export function setConfig<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
  config.set(key, value);
}

export function getAllConfig(): AppConfig {
  return {
    url: config.get('url'),
    format: config.get('format'),
    limit: config.get('limit'),
  };
}

export function isConfigured(): boolean {
  return config.has('url');
}

export function showConfig(): void {
  const allConfig = getAllConfig();
  console.log(chalk.bold('\nCurrent Configuration:\n'));
  console.log(`  ${chalk.cyan('URL:')}    ${allConfig.url}`);
  console.log(`  ${chalk.cyan('Format:')} ${allConfig.format || 'not set'}`);
  console.log(`  ${chalk.cyan('Limit:')}  ${allConfig.limit || 'not set'}`);
  console.log();
  console.log(chalk.gray(`Config file: ${config.path}`));
  console.log();
}

export function resetConfig(): void {
  config.clear();
  config.set(defaults);
}
