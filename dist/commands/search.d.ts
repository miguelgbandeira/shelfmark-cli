interface SearchOptions {
    audiobook?: boolean;
    ebook?: boolean;
    format?: string;
    limit?: number;
}
export declare function searchCommand(query: string, options: SearchOptions): Promise<void>;
export {};
//# sourceMappingURL=search.d.ts.map