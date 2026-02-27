# Shelfmark CLI

A beautiful command-line interface for the [Shelfmark](https://github.com/calibrain/shelfmark) book/audiobook downloader API.

![License](https://img.shields.io/npm/l/shelfmark-cli)
![Node](https://img.shields.io/node/v/shelfmark-cli)

## Features

- 🔍 Search for books and audiobooks
- 📚 Multiple format support (EPUB, MOBI, M4B, PDF, AZW3)
- 📊 Beautiful table output with colored format badges
- ⏳ Real-time download progress tracking
- ⚙️ Configurable API endpoint and preferences
- 🎨 Polished CLI experience with spinners and progress bars

## Installation

### From npm

```bash
npm install -g shelfmark-cli
```

### From source

```bash
git clone https://github.com/calibrain/shelfmark-cli.git
cd shelfmark-cli
npm install
npm run build
npm link
```

## Prerequisites

This CLI requires a running [Shelfmark server](https://github.com/calibrain/shelfmark). By default, it connects to `http://localhost:8084`.

## Usage

### Search for books

```bash
# Basic search
shelfmark search "atomic habits"

# Search for audiobooks only
shelfmark search "atomic habits" --audiobook

# Filter by format and limit results
shelfmark search "dune" --format epub --limit 20
```

### Download books

```bash
# Queue a download by ID
shelfmark download <id>

# Download and watch progress
shelfmark download <id> --watch

# Download a specific release
shelfmark download <id> --release <releaseId>
```

### Check download status

```bash
# View all downloads (active, queued, completed, errors)
shelfmark status
```

### Cancel downloads

```bash
shelfmark cancel <id>
```

### View available releases

```bash
# See all available releases for a book
shelfmark releases <id>
```

### Configuration

```bash
# Set the API URL
shelfmark config set url http://localhost:8084

# Set default format preference
shelfmark config set format epub

# Set default result limit
shelfmark config set limit 20

# Get a config value
shelfmark config get url

# List all configuration
shelfmark config list

# Reset to defaults
shelfmark config reset
```

## Configuration

Configuration is stored in `~/.shelfmark-cli/config.json`.

| Option   | Default               | Description                    |
|----------|-----------------------|--------------------------------|
| `url`    | `http://localhost:8084` | Shelfmark server URL          |
| `format` | `epub`                | Default format preference      |
| `limit`  | `10`                  | Default search result limit    |

## API Reference

The CLI interacts with the following Shelfmark API endpoints:

| Endpoint                        | Method | Description              |
|---------------------------------|--------|--------------------------|
| `/api/search?query=X&mode=X`    | GET    | Search for books         |
| `/api/download?id=X`            | GET    | Queue a download         |
| `/api/status`                   | GET    | Get download status      |
| `/api/download/<id>/cancel`     | DELETE | Cancel a download        |
| `/api/releases?id=X`            | GET    | Get available releases   |
| `/api/health`                   | GET    | Health check             |

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run built version
npm start
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related

- [Shelfmark](https://github.com/calibrain/shelfmark) - The backend API server
