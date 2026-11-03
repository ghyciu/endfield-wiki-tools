import ToolPanel from '../ToolPanel'

interface LyricsFinderPanelProps {
  onClose: () => void
}

function LyricsFinderPanel({ onClose }: LyricsFinderPanelProps) {
  return (
    <ToolPanel
      title="Lyrics Finder"
      panelId="lyrics-finder-panel"
      onClose={onClose}
    />
  )
}

export default LyricsFinderPanel
