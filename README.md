# Solana Wallet Holdings Viewer

This React application allows you to view the token holdings of any Solana wallet address. The app displays detailed information about each token, including the percentage of the total supply held.

## Features

- Look up token holdings for any Solana wallet address
- Display token metadata, including name, symbol, and images
- Show percentage of total supply, amount held, and total supply for each token
- Sort tokens by percentage of total supply in descending order

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or newer)
- npm or yarn
- Solscan API key

## Environment Setup

Create a `.env.local` file in the root directory with the following content:

```
REACT_APP_SOLSCAN_API_KEY=your_solscan_api_key_here
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To build the app for production, run:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Technologies Used

- React
- TypeScript
- React Router
- Axios for API requests
- Solscan API for fetching wallet data