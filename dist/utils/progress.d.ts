import cliProgress from 'cli-progress';
import { DownloadStatus, StatusResponse } from '../api.js';
export declare function createDownloadProgress(): cliProgress.MultiBar;
export declare function formatSpeed(bytesPerSecond: number): string;
export declare function formatEta(seconds: number): string;
export declare function displayDownloadStatus(status: DownloadStatus): void;
export declare function displayStatusReport(response: StatusResponse): void;
//# sourceMappingURL=progress.d.ts.map