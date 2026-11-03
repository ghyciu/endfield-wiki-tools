import { useState } from 'react'
import AlbumPanel from './components/Album/AlbumPanel'
import LyricsFinderPanel from './components/LyricsFinder/LyricsFinderPanel'
import ToolsPanel from './components/ToolsPanel'
import './App.css'

function App() {
  const [isAlbumPanelOpen, setIsAlbumPanelOpen] = useState(false)
  const [isLyricsFinderOpen, setIsLyricsFinderOpen] = useState(false)

  function openAlbumPanel() {
    setIsAlbumPanelOpen((isOpen) => !isOpen)
    setIsLyricsFinderOpen(false)
  }

  function openLyricsFinderPanel() {
    setIsLyricsFinderOpen((isOpen) => !isOpen)
    setIsAlbumPanelOpen(false)
  }

  return (
    <main className="workspace">
      <ToolsPanel
        isAlbumPageActive={isAlbumPanelOpen}
        isLyricsFinderActive={isLyricsFinderOpen}
        onToggleAlbumPage={openAlbumPanel}
        onToggleLyricsFinder={openLyricsFinderPanel}
      />

      {isAlbumPanelOpen && (
        <AlbumPanel onClose={() => setIsAlbumPanelOpen(false)} />
      )}
      {isLyricsFinderOpen && (
        <LyricsFinderPanel onClose={() => setIsLyricsFinderOpen(false)} />
      )}
    </main>
  )
}

export default App
