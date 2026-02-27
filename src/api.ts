import axios, { AxiosInstance } from 'axios';
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
  status: 'queued' | 'downloading' | 'completed' | 'error';
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

export interface HealthResponse {
  status: string;
  version: string;
}

export class ShelfmarkAPI {
  private client: AxiosInstance;
  private config: Conf<AppConfig>;

  constructor(config: Conf<AppConfig>) {
    this.config = config;
    const baseURL = config.get('url') || 'http://localhost:8084';
    
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async request<T>(method: string, endpoint: string, params?: Record<string, string>): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method,
        url: endpoint,
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(`Cannot connect to Shelfmark server at ${this.client.defaults.baseURL}. Is it running?`);
        }
        if (error.response) {
          throw new Error(`API Error (${error.response.status}): ${error.response.data?.message || error.message}`);
        }
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  async search(query: string, mode?: string): Promise<SearchResult[]> {
    const params: Record<string, string> = { query };
    if (mode) params.mode = mode;
    return this.request<SearchResult[]>('GET', '/api/search', params);
  }

  async download(id: string): Promise<DownloadResponse> {
    return this.request<DownloadResponse>('GET', '/api/download', { id });
  }

  async status(): Promise<StatusResponse> {
    return this.request<StatusResponse>('GET', '/api/status');
  }

  async cancel(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('DELETE', `/api/download/${id}/cancel`);
  }

  async releases(id: string): Promise<ReleasesResponse> {
    return this.request<ReleasesResponse>('GET', '/api/releases', { id });
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', '/api/health');
  }

  getBaseURL(): string {
    return this.client.defaults.baseURL || '';
  }
}
