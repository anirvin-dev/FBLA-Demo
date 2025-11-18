# Yolo — Byte-Sized Business Boost

## About

Yolo is a business discovery and rewards platform that helps users find local businesses, leave reviews, and earn points redeemable with partner retailers. This is an FBLA demo application.

## Setup

### Prerequisites

Yolo requires a local installation of [Node.js](https://nodejs.org/en/download/) and [pnpm](https://pnpm.io/installation). We recommend using [nvm](https://github.com/nvm-sh/nvm) (MacOS/Linux) or [fnm](https://github.com/Schniz/fnm) (Windows) to manage your Node.js installation.

### Quick Start (Demo Mode)

This is a **demo application** that runs entirely in the browser with no external dependencies:

1. Clone the repository
2. Run `pnpm install` in the root directory
3. Run `pnpm dev:scouting` to start the development server
4. Open `http://localhost:3000` in your browser
5. Click "Get Started" and use the demo login

**No environment variables or external services required!** All data is stored locally in browser localStorage.

### Demo Features

- **Business Discovery**: Browse and search local businesses by category
- **Reviews & Ratings**: Leave reviews and earn points
- **Points System**: Earn points through reviews and purchases, redeem with partners
- **Bookmarks**: Save your favorite businesses
- **Bot Verification**: Simple challenge before posting reviews or claiming deals
- **Dev Admin Panel**: Seed demo data, reset, and toggle dev mode (`/admin/dev`)

### Development

For development with hot reload:
```bash
pnpm install
pnpm dev:scouting
```

The app will be available at `http://localhost:3000`.
