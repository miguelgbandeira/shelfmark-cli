interface DownloadOptions {
    release?: string;
    watch?: boolean;
    ebook?: boolean;
    audiobook?: boolean;
    format?: string;
}
export declare function downloadCommand(id: string, options: DownloadOptions): Promise<void>;
export {};
//# sourceMappingURL=download.d.ts.map