import type { ReactNode } from 'react'

interface ToolPanelProps {
  title: string
  panelId: string
  onClose: () => void
  children?: ReactNode
}

function ToolPanel({
  title,
  panelId,
  onClose,
  children,
}: ToolPanelProps) {
  return (
    <section className="tool-panel" aria-labelledby={`${panelId}-title`}>
      <header className="tool-panel__header">
        <h2 id={`${panelId}-title`}>{title}</h2>
        <button
          className="tool-panel__close"
          type="button"
          aria-label={`Close ${title} panel`}
          onClick={onClose}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </header>
      {children}
    </section>
  )
}

export default ToolPanel
