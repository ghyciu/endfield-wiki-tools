type JsonRecord = Record<string, unknown>

function asRecord(value: unknown): JsonRecord | null {
  return typeof value === 'object' && value !== null
    ? (value as JsonRecord)
    : null
}

function getProperty(value: unknown, property: string): unknown {
  return asRecord(value)?.[property]
}

export function getSongId(searchResponse: unknown): string {
  const result = getProperty(searchResponse, 'result')
  const songs = getProperty(result, 'songs')
  const firstSong = Array.isArray(songs) ? songs[0] : null
  const songId = getProperty(firstSong, 'id')

  if (
    (typeof songId !== 'number' && typeof songId !== 'string') ||
    String(songId).trim().length === 0
  ) {
    throw new Error('Music search did not return a song ID')
  }

  return String(songId)
}

export function getLyricsText(lyricsResponse: unknown): string {
  const lyric = getProperty(getProperty(lyricsResponse, 'lrc'), 'lyric')

  if (typeof lyric !== 'string' || lyric.trim().length === 0) {
    throw new Error('The song does not contain lyrics')
  }

  return lyric
}

export function parseLyrics(rawLyrics: string): string {
  const lyrics = rawLyrics
    .replace(/\[\d{1,3}:\d{2}(?:\.\d+)?\]/g, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join('\n')
    .trim()

  if (lyrics.length === 0) {
    throw new Error('The song does not contain usable lyrics')
  }

  return lyrics
}
