import ToolPanel from '../ToolPanel'
import LyricsInput from './LyricsInput'

interface LyricsFinderPanelProps {
  onClose: () => void
}

function LyricsFinderPanel({ onClose }: LyricsFinderPanelProps) {
  return (
    <ToolPanel
      title="Lyrics Finder"
      panelId="lyrics-finder-panel"
      onClose={onClose}
    >
      <LyricsInput />
    </ToolPanel>
  )
}

export default LyricsFinderPanel
