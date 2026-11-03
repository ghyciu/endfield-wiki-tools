interface ToolsPanelProps {
  isAlbumPageActive: boolean
  isLyricsFinderActive: boolean
  onToggleAlbumPage: () => void
  onToggleLyricsFinder: () => void
}

function ToolsPanel({
  isAlbumPageActive,
  isLyricsFinderActive,
  onToggleAlbumPage,
  onToggleLyricsFinder,
}: ToolsPanelProps) {
  return (
    <aside className="tools-panel" aria-label="Tools Panel">
      <h1 className="tools-panel__title">Tools Panel</h1>
      <button
        className={`tool-option${isAlbumPageActive ? ' tool-option--active' : ''}`}
        type="button"
        aria-pressed={isAlbumPageActive}
        onClick={onToggleAlbumPage}
      >
        <svg
          className="tool-option__icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="3.5" y="4" width="17" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m5 17 4.5-4 3 2.5 2.5-2 4 3.5" />
        </svg>
        <span>Album Page</span>
      </button>
      <button
        className={`tool-option${isLyricsFinderActive ? ' tool-option--active' : ''}`}
        type="button"
        aria-pressed={isLyricsFinderActive}
        onClick={onToggleLyricsFinder}
      >
        <svg
          className="tool-option__icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 6.5h14M5 12h14M5 17.5h9" />
        </svg>
        <span>Lyrics Finder</span>
      </button>
    </aside>
  )
}

export default ToolsPanel
