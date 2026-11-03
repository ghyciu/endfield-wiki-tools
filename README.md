# endfield-wiki-tools
Endfield Wiki Tools

## Getting started

### Prerequisites

Install the current [Node.js LTS release](https://nodejs.org/). npm is included with Node.js. After installation, open a new terminal and verify both are available:

```sh
node --version
npm --version
```

### Install and run

From the project directory, install the dependencies and start the development server:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`) in your browser. Press **Ctrl+C** in the terminal to stop the server.

## Album workflow

In the Album Page panel, enter a Spotify album URL and select **Start**. The workflow:

1. Fetches the Spotify album embed through the local proxy and extracts the album title, artist, cover, and songs.
2. Parses the structured album details and song Spotify IDs.
3. Converts the album into `Soundtrack head`, `Soundtrack cell`, and `Table end` wiki templates and prints the result in the Output panel.
4. Removes the temporary album data after processing, including when an earlier step fails.

Each step is reflected in the progress bar and logged in both the in-app Console and the browser developer console. During local development, Vite proxies supported `open.spotify.com` requests through `/api/spotify`, avoiding browser CORS restrictions. Run the app with `npm run dev`; this proxy is not available in the production build.

## Lyrics Finder workflow

In the Lyrics Finder panel, enter a song name and artist and select **Start**. The workflow:

1. Searches NetEase Cloud Music for the first matching song and gets its ID.
2. Fetches the song lyrics using that ID.
3. Removes lyric timestamps while preserving lyric lines and consecutive line breaks.
4. Converts the lyrics to a `<poem>` wiki block and prints the result in the Output panel.

The local Vite development server proxies the NetEase requests through `/api/netease` to avoid browser CORS restrictions. This proxy is not available in the production build.
