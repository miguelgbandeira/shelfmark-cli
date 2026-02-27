# 📚 Shelfmark CLI

<div align="center">

A beautiful command-line interface for [Shelfmark](https://github.com/calibrain/shelfmark) — the self-hosted book and audiobook downloader.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v-lts.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

[Installation](#installation) • [Usage](#usage) • [Configuration](#configuration) • [Contributing](#contributing)

</div>

---

## Features

- 🔍 **Search** books and audiobooks from multiple sources
- 📥 **Download** EPUB, MOBI, PDF, M4B, MP3 formats
- 🎨 **Beautiful output** with colored format badges and tables
- ⏳ **Progress tracking** with real-time download status
- ⚙️ **Configurable** API endpoint and preferences
- 🚀 **Fast and lightweight** TypeScript implementation

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Shelfmark server](https://github.com/calibrain/shelfmark) running locally or remotely

### From Source

```bash
git clone https://github.com/miguelgbandeira/shelfmark-cli.git
cd shelfmark-cli
npm install
npm run build
npm link
```

After installation, the `shelfmark` command will be available globally.

## Usage

```
_____ _    _ _____  _____ _____ _____ _      ______ ______ 
|  __ \| |  | |  __ \|  __ \_   _|_   _| |    |  ____|  ____|
| |__) | |__| | |__) | |  | || |   | | | |    | |__  | |__   
|  ___/|  __  |  ___/| |  | || |   | | | |    |  __| |  __|  
| |    | |  | | |    | |__| || |_ _| |_| |____| |____| |____ 
|_|    |_|  |_|_|    |_____/ |__|_____|______|______|______|
                                                            
A beautiful CLI for the Shelfmark book/audiobook downloader
```

### Search for Books

```bash
# Basic search
shelfmark search "atomic habits"

# Search for audiobooks only (M4B, MP3)
shelfmark search "atomic habits" --audiobook

# Search for ebooks only (EPUB, MOBI, PDF)
shelfmark search "atomic habits" --ebook

# Filter by specific format
shelfmark search "dune" --format m4b

# Limit results
shelfmark search "programming" --limit 20
```

**Example output:**

```
Search results for "atomic habits"

┌────┬─────────────────────────────────┬──────────────┬─────────┬────────┬───────┐
│ #  │ Title                           │ Author       │ Format  │ Size   │ Year  │
├────┼─────────────────────────────────┼──────────────┼─────────┼────────┼───────┤
│ 1  │ Atomic Habits: Tiny Changes...  │ Clear, James │  EPUB   │ 4.6MB  │ 2018  │
├────┼─────────────────────────────────┼──────────────┼─────────┼────────┼───────┤
│ 2  │ Atomic Habits: An Easy and...   │ Clear, James │  EPUB   │ 3.7MB  │ 2018  │
└────┴─────────────────────────────────┴──────────────┴─────────┴────────┴───────┘

Showing 2 of 50 results
```

### Download Books

```bash
# Queue a download by ID
shelfmark download <id>

# Download and watch progress in real-time
shelfmark download <id> --watch

# Download with format preference
shelfmark download <id> --audiobook
shelfmark download <id> --ebook
shelfmark download <id> --format m4b
```

> **Note:** For audiobooks, the web UI is recommended to select specific releases from AudiobookBay.

### Check Download Status

```bash
shelfmark status
```

```
Active Downloads:

████████████████████░░░░░░░░ 67% | 2.3 MB/s | Atomic Habits

Completed:
  ✓ Be Water, My Friend (MP3)
  ✓ Rich Dad Poor Dad (M4B)
```

### View Available Releases

```bash
shelfmark releases <id>
```

### Cancel Downloads

```bash
shelfmark cancel <id>
```

### Configuration

```bash
# Set Shelfmark server URL
shelfmark config set url http://localhost:8084

# Set default format preference
shelfmark config set format epub

# Set default search result limit
shelfmark config set limit 20

# View current configuration
shelfmark config list

# Get a specific config value
shelfmark config get url

# Reset to defaults
shelfmark config reset
```

## Configuration File

Configuration is stored in:

- **Linux/macOS:** `~/.config/shelfmark-cli-nodejs/config.json`
- **Windows:** `%APPDATA%\shelfmark-cli-nodejs\config.json`

| Option  | Default              | Description               |
|---------|----------------------|---------------------------|
| `url`   | `http://localhost:8084` | Shelfmark server URL   |
| `format`| `epub`               | Default format preference |
| `limit` | `10`                 | Default result limit      |

## Supported Formats

| Format | Type      | Badge Color |
|--------|-----------|-------------|
| EPUB   | Ebook     | Blue        |
| MOBI   | Ebook     | Green       |
| PDF    | Ebook     | Red         |
| AZW3   | Ebook     | Yellow      |
| M4B    | Audiobook | Magenta     |
| MP3    | Audiobook | Cyan        |

## API Endpoints

The CLI interacts with the following Shelfmark API endpoints:

| Endpoint                    | Method | Description           |
|-----------------------------|--------|-----------------------|
| `/api/search`               | GET    | Search for books      |
| `/api/download`             | GET    | Queue a download      |
| `/api/status`               | GET    | Get download status   |
| `/api/download/<id>/cancel` | DELETE | Cancel a download     |
| `/api/releases`             | GET    | Get available releases|
| `/api/health`               | GET    | Health check          |

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run locally
node dist/index.js search "test"

# Watch mode for development
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Interactive search with fuzzy matching
- [ ] Batch downloads from wishlist
- [ ] Auto-select best release by quality preferences
- [ ] Notification support when downloads complete
- [ ] Direct format selection via API (pending Shelfmark support)

## Related Projects

- [Shelfmark](https://github.com/calibrain/shelfmark) - The backend API server
- [Audiobookshelf](https://github.com/advplyr/audiobookshelf) - Audiobook server
- [Booklore](https://github.com/booklore-app/booklore) - Ebook manager

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Miguel Bandeira](https://github.com/miguelgbandeira)

</div>
