import type { AlbumDetails } from './albumParser'

function escapeWikiValue(value: string): string {
  return value.replace(/\r?\n/g, ' ').replace(/\|/g, '&#124;').trim()
}

export function formatAlbumAsWiki(album: AlbumDetails): string {
  const trackCells = album.tracks.map((track) =>
    [
      '{{Soundtrack cell',
      `|no = ${track.number}`,
      `|title = ${escapeWikiValue(track.title)}`,
      `|length = ${escapeWikiValue(track.duration)}`,
      `|artist = ${escapeWikiValue(track.artist)}`,
      `|spotify = ${escapeWikiValue(track.spotify)}`,
      '}}',
    ].join('\n'),
  )

  return [
    '{{Soundtrack head|unofficial=false}}',
    ...trackCells,
    '{{Table end}}',
  ].join('\n')
}
