import Conf from 'conf';
export interface AppConfig {
    url: string;
    format?: string;
    limit?: number;
}
export declare const config: Conf<AppConfig>;
export declare function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K];
export declare function setConfig<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void;
export declare function getAllConfig(): AppConfig;
export declare function isConfigured(): boolean;
export declare function showConfig(): void;
export declare function resetConfig(): void;
//# sourceMappingURL=config.d.ts.map