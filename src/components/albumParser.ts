export interface AlbumTrack {
  number: number
  title: string
  artist: string
  duration: string
  spotify: string
}

export interface AlbumDetails {
  title: string
  artist: string
  coverUrl: string
  sourceUrl: string
  tracks: AlbumTrack[]
}

type JsonRecord = Record<string, unknown>

function asRecord(value: unknown): JsonRecord | null {
  return typeof value === 'object' && value !== null
    ? (value as JsonRecord)
    : null
}

function getProperty(value: unknown, property: string): unknown {
  return asRecord(value)?.[property]
}

function getRequiredString(value: unknown, description: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Spotify embed is missing ${description}`)
  }

  return value.trim()
}

function getRequiredNumber(value: unknown, description: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Spotify embed is missing ${description}`)
  }

  return value
}

function getSpotifyTrackId(uri: string, trackNumber: number): string {
  const parts = uri.split(':')
  const trackId = parts[2]

  if (parts[0] !== 'spotify' || parts[1] !== 'track' || !trackId) {
    throw new Error(`Spotify embed has an invalid ID for song ${trackNumber}`)
  }

  return trackId
}

function formatDuration(durationMilliseconds: number): string {
  const totalSeconds = Math.round(durationMilliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

function normalizeArtists(artists: string): string {
  return artists
    .split(',')
    .map((artist) => artist.trim())
    .filter(Boolean)
    .join(', ')
}

export function parseAlbumDetails(
  sourceHtml: string,
  sourceUrl: string,
): AlbumDetails {
  const document = new DOMParser().parseFromString(sourceHtml, 'text/html')
  const nextDataElement = document.querySelector(
    'script#__NEXT_DATA__[type="application/json"]',
  )
  const coverUrl = document
    .querySelector('img[alt*="cover"]')
    ?.getAttribute('src')
    ?.trim()
  const nextDataText = nextDataElement?.textContent?.trim()

  if (!nextDataText) {
    throw new Error('Spotify embed is missing structured album data')
  }

  if (!coverUrl) {
    throw new Error('Spotify embed is missing album cover art')
  }

  const nextData: unknown = JSON.parse(nextDataText)
  const entity = asRecord(
    getProperty(
      getProperty(
        getProperty(
          getProperty(getProperty(nextData, 'props'), 'pageProps'),
          'state',
        ),
        'data',
      ),
      'entity',
    ),
  )
  const trackList = getProperty(entity, 'trackList')

  if (!entity || !Array.isArray(trackList) || trackList.length === 0) {
    throw new Error('Spotify embed does not contain any songs')
  }

  const title = getRequiredString(
    getProperty(entity, 'name') ?? getProperty(entity, 'title'),
    'album title',
  )
  const artist = normalizeArtists(
    getRequiredString(getProperty(entity, 'subtitle'), 'album artist'),
  )
  const tracks = trackList.map((value, index) => {
    const track = asRecord(value)
    const trackNumber = index + 1
    const duration = getRequiredNumber(
      getProperty(track, 'duration'),
      `song ${trackNumber} duration`,
    )
    const uri = getRequiredString(
      getProperty(track, 'uri'),
      `song ${trackNumber} Spotify URI`,
    )

    return {
      number: trackNumber,
      title: getRequiredString(
        getProperty(track, 'title'),
        `song ${trackNumber} title`,
      ),
      artist: normalizeArtists(
        getRequiredString(
          getProperty(track, 'subtitle'),
          `song ${trackNumber} artist`,
        ),
      ),
      duration: formatDuration(duration),
      spotify: getSpotifyTrackId(uri, trackNumber),
    }
  })

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
    typeof track.duration === 'string' &&
    typeof track.spotify === 'string'
  )
}
