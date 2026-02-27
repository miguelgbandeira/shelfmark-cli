import { SearchResult, Release } from '../api.js';
export declare function formatBytes(sizeStr: string | number): string;
export declare function formatBadge(format: string): string;
export declare function displaySearchResults(results: SearchResult[], total?: number): void;
export declare function displayReleases(releases: Release[]): void;
export declare function displayError(message: string): void;
export declare function displaySuccess(message: string): void;
export declare function displayInfo(message: string): void;
export declare function displayWarning(message: string): void;
export declare const BANNER: string;
//# sourceMappingURL=output.d.ts.map