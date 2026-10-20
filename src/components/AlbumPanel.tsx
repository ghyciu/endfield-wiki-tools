import { useState } from 'react'
import ProgressBar, { type ProgressStep } from './ProgressBar'
import Console, { type ConsoleInfo } from './Console'
import Output from './Output'
import SpotifyInput from './SpotifyInput'
import {
  isAlbumDetails,
  parseAlbumDetails,
} from './albumParser'
import { formatAlbumAsWiki } from './wikiFormatter'

interface AlbumPanelProps {
  onClose: () => void
}

const initialProgressSteps: readonly ProgressStep[] = [
  { id: 'fetch', label: 'Fetch Album', state: 'pending' },
  { id: 'process', label: 'Parse Details', state: 'pending' },
  { id: 'convert', label: 'Convert Wiki', state: 'pending' },
  { id: 'cleanup', label: 'Cleanup', state: 'pending' },
]

const temporarySourceKey = 'endfield-wiki-tools:temporary-album-source'
const temporaryAlbumKey = 'endfield-wiki-tools:temporary-album'

const initialOutputText = `Album Page output
Enter a Spotify link and press Start to begin.`

function AlbumPanel({ onClose }: AlbumPanelProps) {
  const [progressSteps, setProgressSteps] = useState(initialProgressSteps)
  const [outputText, setOutputText] = useState(initialOutputText)
  const [consoleLines, setConsoleLines] = useState<string[]>([
    '[album] Waiting for a Spotify link...',
  ])
  const [lastEvent, setLastEvent] = useState('Waiting for source data')
  const [isProcessing, setIsProcessing] = useState(false)

  function log(message: string) {
    setConsoleLines((currentLines) => [...currentLines, message])
    setLastEvent(message.replace(/^\[[^\]]+\]\s*/, ''))
  }

  function setStepState(stepId: string, state: ProgressStep['state']) {
    setProgressSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === stepId ? { ...step, state } : step,
      ),
    )
  }

  async function yieldToBrowser() {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 0)
    })
  }

  function getSpotifyEmbedProxyUrl(spotifyLink: string) {
    const url = new URL(spotifyLink)

    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com') {
      throw new Error('Only https://open.spotify.com links are supported')
    }

    const pathSegments = url.pathname.split('/').filter(Boolean)
    const albumIndex = pathSegments.indexOf('album')
    const albumId = pathSegments[albumIndex + 1]

    if (albumIndex === -1 || !albumId) {
      throw new Error('The Spotify link must point to an album')
    }

    return `/api/spotify/embed/album/${encodeURIComponent(albumId)}`
  }

    async function handleStart(spotifyLink: string) {
    setIsProcessing(true)
    setProgressSteps(
      initialProgressSteps.map((step) => ({ ...step, state: 'pending' })),
    )
    setOutputText('Starting Album Page workflow...')
    setConsoleLines([])
    console.log('[album] Starting workflow', { spotifyLink })
    log(`[album] Starting workflow for ${spotifyLink}`)

    let activeStep = 'fetch'

    try {
      setStepState('fetch', 'loading')
      log('[fetch] Getting Spotify album embed...')
      console.log('[fetch] Getting Spotify album embed')
      const proxyUrl = getSpotifyEmbedProxyUrl(spotifyLink)
      log(`[fetch] Using local development proxy: ${proxyUrl}`)
      console.log('[fetch] Using local development proxy', { proxyUrl })
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`Spotify request failed with status ${response.status}`)
      }

      const sourceHtml = await response.text()
      sessionStorage.setItem(temporarySourceKey, sourceHtml)
      activeStep = 'process'
      setStepState('fetch', 'completed')
      log('[fetch] Stored Spotify album embed in temporary storage')
      console.log('[fetch] Album embed stored in temporary storage')

      await yieldToBrowser()
      setStepState('process', 'loading')
      log('[process] Parsing album details and songs...')
      console.log('[process] Parsing album details and songs')
      await yieldToBrowser()
      const storedSource = sessionStorage.getItem(temporarySourceKey)

      if (storedSource === null) {
        throw new Error('Temporary album source is empty')
      }

      const parsedAlbumDetails = parseAlbumDetails(storedSource, spotifyLink)
      sessionStorage.setItem(
        temporaryAlbumKey,
        JSON.stringify(parsedAlbumDetails),
      )
      setStepState('process', 'completed')
      log(
        `[process] Parsed ${parsedAlbumDetails.tracks.length} songs from album`,
      )
      console.log('[process] Album details parsed', {
        songs: parsedAlbumDetails.tracks.length,
      })

      activeStep = 'convert'
      await yieldToBrowser()
      setStepState('convert', 'loading')
      log('[convert] Reading album details for wiki conversion...')
      console.log('[convert] Reading album details for wiki conversion')
      await yieldToBrowser()
      const storedAlbum = sessionStorage.getItem(temporaryAlbumKey)

      if (storedAlbum === null) {
        throw new Error('Temporary album details are empty')
      }

      const storedAlbumDetails: unknown = JSON.parse(storedAlbum)

      if (!isAlbumDetails(storedAlbumDetails)) {
        throw new Error('Temporary album details contain invalid data')
      }

      setOutputText(formatAlbumAsWiki(storedAlbumDetails))
      setStepState('convert', 'completed')
      log('[convert] Printed wiki format to Output')
      console.log('[convert] Printed wiki format to Output')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown workflow error'
      setStepState(activeStep, 'failed')
      setOutputText(`Album Page workflow failed:\n${message}`)
      log(`[${activeStep}] Failed: ${message}`)
      console.error(`[${activeStep}] Workflow step failed`, error)
    } finally {
      setStepState('cleanup', 'loading')
      log('[cleanup] Removing temporary album data...')
      console.log('[cleanup] Removing temporary album data')
      await yieldToBrowser()

      try {
        sessionStorage.removeItem(temporarySourceKey)
        sessionStorage.removeItem(temporaryAlbumKey)
        setStepState('cleanup', 'completed')
        log('[cleanup] Temporary album data removed')
        console.log('[cleanup] Temporary album data removed')
      } catch (error) {
        setStepState('cleanup', 'failed')
        const message =
          error instanceof Error ? error.message : 'Unknown cleanup error'
        log(`[cleanup] Failed: ${message}`)
        console.error('[cleanup] Failed to remove temporary album data', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const albumConsoleInfo: readonly ConsoleInfo[] = [
    { label: 'Source', value: 'Spotify link' },
    { label: 'Mode', value: 'Wiki conversion workflow' },
    { label: 'Last event', value: lastEvent },
  ]

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
      <SpotifyInput onStart={handleStart} disabled={isProcessing} />
      <section className="album-panel__progress" aria-labelledby="album-progress-title">
        <h3 id="album-progress-title">Progress</h3>
        <ProgressBar steps={progressSteps} ariaLabel="Album page progress" />
      </section>
      <Output text={outputText} />
      <Console
        debugText={consoleLines.join('\n')}
        additionalInfo={albumConsoleInfo}
      />
    </section>
  )
}

export default AlbumPanel
