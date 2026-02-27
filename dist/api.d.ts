import Conf from 'conf';
import { AppConfig } from './config.js';
export interface SearchResult {
    id: string;
    title: string;
    author: string;
    format: string;
    size: string;
    year: string;
    publisher?: string;
    language?: string;
    content?: string;
    preview?: string;
}
export interface DownloadResponse {
    id: string;
    status: string;
    message: string;
}
export interface DownloadStatus {
    id: string;
    title: string;
    status: string;
    progress: number;
    speed?: string;
    eta?: string;
    error?: string;
}
export interface StatusResponse {
    available: Record<string, DownloadStatus>;
    cancelled: Record<string, DownloadStatus>;
    complete: Record<string, DownloadStatus>;
    done: Record<string, DownloadStatus>;
    downloading: Record<string, DownloadStatus>;
    error: Record<string, DownloadStatus>;
    locating: Record<string, DownloadStatus>;
    queued: Record<string, DownloadStatus>;
    resolving: Record<string, DownloadStatus>;
}
export interface Release {
    id: string;
    title: string;
    quality: string;
    size: string;
    format: string;
    source: string;
}
export interface ReleasesResponse {
    releases: Release[];
}
export interface DownloadUrl {
    format?: string;
    url: string;
    size?: string;
}
export interface BookInfo {
    id: string;
    title: string;
    author: string;
    download_urls: string[] | DownloadUrl[];
    format?: string;
    size?: string;
    year?: string;
    publisher?: string;
    language?: string;
}
export interface HealthResponse {
    status: string;
    version: string;
}
export declare class ShelfmarkAPI {
    private client;
    private config;
    constructor(config: Conf<AppConfig>);
    private request;
    search(query: string, mode?: string): Promise<SearchResult[]>;
    download(id: string, format?: string): Promise<DownloadResponse>;
    info(id: string): Promise<BookInfo>;
    status(): Promise<StatusResponse>;
    cancel(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    releases(id: string): Promise<ReleasesResponse>;
    health(): Promise<HealthResponse>;
    getBaseURL(): string;
}
//# sourceMappingURL=api.d.ts.map