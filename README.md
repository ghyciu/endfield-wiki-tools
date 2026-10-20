# endfield-wiki-tools
Endfield Wiki Tools

## Album workflow

In the Album Page panel, enter a Spotify album URL and select **Start**. The workflow:

1. Fetches the Spotify album embed through the local proxy and extracts the album title, artist, cover, and songs.
2. Stores the structured album details in browser session storage, then prints them in the Output panel.
3. Removes the temporary album details after processing, including when an earlier step fails.

Each step is reflected in the progress bar and logged in both the in-app Console and the browser developer console. During local development, Vite proxies supported `open.spotify.com` requests through `/api/spotify`, avoiding browser CORS restrictions. Run the app with `npm run dev`; this proxy is not available in the production build.
