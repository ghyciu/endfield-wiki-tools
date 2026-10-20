import ProgressBar, { type ProgressStep } from './ProgressBar'

interface AlbumPanelProps {
  onClose: () => void
}

const albumProgressSteps: readonly ProgressStep[] = [
  { id: 'assets', label: 'Assets', state: 'completed' },
  { id: 'data', label: 'Data', state: 'loading' },
  { id: 'pages', label: 'Pages', state: 'pending' },
]

function AlbumPanel({ onClose }: AlbumPanelProps) {
  return (
    <section className="album-panel" aria-labelledby="album-panel-title">
      <header className="album-panel__header">
        <h2 id="album-panel-title">Album Page</h2>
        <button
          className="album-panel__close"
          type="button"
          aria-label="Close Album Page panel"
          onClick={onClose}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </header>
      <section className="album-panel__progress" aria-labelledby="album-progress-title">
        <h3 id="album-progress-title">Progress</h3>
        <ProgressBar steps={albumProgressSteps} ariaLabel="Album page progress" />
      </section>
    </section>
  )
}

export default AlbumPanel
