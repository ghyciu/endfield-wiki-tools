export interface AlbumTrack {
  number: number
  title: string
  artist: string
  duration: string
}

export interface AlbumDetails {
  title: string
  artist: string
  coverUrl: string
  sourceUrl: string
  tracks: AlbumTrack[]
}

function getRequiredText(
  element: Element | null,
  description: string,
): string {
  const text = element?.textContent?.trim()

  if (!text) {
    throw new Error(`Spotify embed is missing ${description}`)
  }

  return text
}

export function parseAlbumDetails(
  sourceHtml: string,
  sourceUrl: string,
): AlbumDetails {
  const document = new DOMParser().parseFromString(sourceHtml, 'text/html')
  const metadata = document.querySelector(
    '[class*="CondensedMetadata_condensedMetadataContainer"]',
  )
  const metadataParts = metadata
    ? Array.from(metadata.children)
        .map((element) => element.textContent?.trim() ?? '')
        .filter((part) => part.length > 0 && part !== '·')
    : []

  const title = metadataParts[0]
  const artist = metadataParts[1]
  const coverUrl = document
    .querySelector('img[alt*="cover"]')
    ?.getAttribute('src')
    ?.trim()
  const rows = Array.from(
    document.querySelectorAll('[data-testid^="tracklist-row-"]'),
  )

  if (!title || !artist) {
    throw new Error('Spotify embed is missing album title or artist')
  }

  if (!coverUrl) {
    throw new Error('Spotify embed is missing album cover art')
  }

  if (rows.length === 0) {
    throw new Error('Spotify embed does not contain any songs')
  }

  const tracks = rows.map((row, index) => ({
    number: Number.parseInt(
      row.querySelector('[data-testid="playback-indicator"]')?.textContent ?? '',
      10,
    ) || index + 1,
    title: getRequiredText(row.querySelector('h3'), `song ${index + 1} title`),
    artist: getRequiredText(
      row.querySelector('h4'),
      `song ${index + 1} artist`,
    ),
    duration: getRequiredText(
      row.querySelector('[data-testid="duration-cell"]'),
      `song ${index + 1} duration`,
    ),
  }))

  return {
    title,
    artist,
    coverUrl,
    sourceUrl,
    tracks,
  }
}

export function isAlbumDetails(value: unknown): value is AlbumDetails {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const album = value as Partial<AlbumDetails>

  return (
    typeof album.title === 'string' &&
    typeof album.artist === 'string' &&
    typeof album.coverUrl === 'string' &&
    typeof album.sourceUrl === 'string' &&
    Array.isArray(album.tracks) &&
    album.tracks.every(isAlbumTrack)
  )
}

function isAlbumTrack(value: unknown): value is AlbumTrack {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const track = value as Partial<AlbumTrack>

  return (
    typeof track.number === 'number' &&
    typeof track.title === 'string' &&
    typeof track.artist === 'string' &&
    typeof track.duration === 'string'
  )
}
