import axios from 'axios';
export class ShelfmarkAPI {
    client;
    config;
    constructor(config) {
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
    async request(method, endpoint, params) {
        try {
            const response = await this.client.request({
                method,
                url: endpoint,
                params,
            });
            return response.data;
        }
        catch (error) {
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
    async search(query, mode) {
        const params = { query };
        if (mode)
            params.mode = mode;
        return this.request('GET', '/api/search', params);
    }
    async download(id, format) {
        const params = { id };
        if (format)
            params.format = format;
        return this.request('GET', '/api/download', params);
    }
    async info(id) {
        return this.request('GET', '/api/info', { id });
    }
    async status() {
        return this.request('GET', '/api/status');
    }
    async cancel(id) {
        return this.request('DELETE', `/api/download/${id}/cancel`);
    }
    async releases(id) {
        return this.request('GET', '/api/releases', { id });
    }
    async health() {
        return this.request('GET', '/api/health');
    }
    getBaseURL() {
        return this.client.defaults.baseURL || '';
    }
}
//# sourceMappingURL=api.js.map