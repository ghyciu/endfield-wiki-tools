# endfield-wiki-tools
Endfield Wiki Tools

## Album workflow

In the Album Page panel, enter a Spotify album URL and select **Start**. The workflow:

1. Fetches the Spotify album embed through the local proxy and extracts the album title, artist, cover, and songs.
2. Parses the structured album details and song Spotify IDs.
3. Converts the album into `Soundtrack head`, `Soundtrack cell`, and `Table end` wiki templates and prints the result in the Output panel.
4. Removes the temporary album data after processing, including when an earlier step fails.

Each step is reflected in the progress bar and logged in both the in-app Console and the browser developer console. During local development, Vite proxies supported `open.spotify.com` requests through `/api/spotify`, avoiding browser CORS restrictions. Run the app with `npm run dev`; this proxy is not available in the production build.
