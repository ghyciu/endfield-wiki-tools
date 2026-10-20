interface ToolsPanelProps {
  isAlbumPageActive: boolean
  onToggleAlbumPage: () => void
}

function ToolsPanel({ isAlbumPageActive, onToggleAlbumPage }: ToolsPanelProps) {
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
    </aside>
  )
}

export default ToolsPanel
