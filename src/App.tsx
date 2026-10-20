import { useState } from 'react'
import AlbumPanel from './components/AlbumPanel'
import ToolsPanel from './components/ToolsPanel'
import './App.css'

function App() {
  const [isAlbumPanelOpen, setIsAlbumPanelOpen] = useState(false)

  return (
    <main className="workspace">
      <ToolsPanel
        isAlbumPageActive={isAlbumPanelOpen}
        onToggleAlbumPage={() => setIsAlbumPanelOpen((isOpen) => !isOpen)}
      />

      {isAlbumPanelOpen && (
        <AlbumPanel onClose={() => setIsAlbumPanelOpen(false)} />
      )}
    </main>
  )
}

export default App
