import { useState } from 'react'
import Console, { type ConsoleInfo } from '../common/Console'
import Output from '../common/Output'
import ProgressBar, { type ProgressStep } from '../common/ProgressBar'
import { formatLyricsAsWiki } from '../common/wikiFormatter'
import ToolPanel from '../ToolPanel'
import LyricsInput from './LyricsInput'
import {
  getLyricsText,
  getSongId,
  parseLyrics,
} from './lyricsParser'

interface LyricsFinderPanelProps {
  onClose: () => void
}

const initialProgressSteps: readonly ProgressStep[] = [
  { id: 'search', label: 'Find Song', state: 'pending' },
  { id: 'fetch', label: 'Fetch Lyrics', state: 'pending' },
  { id: 'process', label: 'Parse Lyrics', state: 'pending' },
  { id: 'convert', label: 'Convert Wiki', state: 'pending' },
  { id: 'cleanup', label: 'Cleanup', state: 'pending' },
]

const initialOutputText = `Lyrics output
Enter a song name and artist and press Start to begin.`

const apiBaseUrl = import.meta.env.DEV
  ? '/api/netease'
  : 'https://music.163.com'

function LyricsFinderPanel({ onClose }: LyricsFinderPanelProps) {
  const [progressSteps, setProgressSteps] = useState(initialProgressSteps)
  const [outputText, setOutputText] = useState(initialOutputText)
  const [consoleLines, setConsoleLines] = useState<string[]>([
    '[lyrics] Waiting for a song name and artist...',
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

  async function handleStart(searchText: string) {
    setIsProcessing(true)
    setProgressSteps(
      initialProgressSteps.map((step) => ({ ...step, state: 'pending' })),
    )
    setOutputText('Starting Lyrics Finder workflow...')
    setConsoleLines([])
    console.log('[lyrics] Starting workflow', { searchText })
    log(`[lyrics] Starting workflow for ${searchText}`)

    let activeStep = 'search'

    try {
      setStepState('search', 'loading')
      log('[search] Looking up the song...')
      console.log('[search] Looking up song')
      const searchUrl = `${apiBaseUrl}/api/search/get/?s=${encodeURIComponent(
        searchText,
      )}&type=1&limit=1`
      const searchResponse = await fetch(searchUrl)

      if (!searchResponse.ok) {
        throw new Error(
          `Music search failed with status ${searchResponse.status}`,
        )
      }

      const searchPayload: unknown = await searchResponse.json()
      const songId = getSongId(searchPayload)
      setStepState('search', 'completed')
      log(`[search] Found song ID ${songId}`)
      console.log('[search] Song found', { songId })

      activeStep = 'fetch'
      await yieldToBrowser()
      setStepState('fetch', 'loading')
      log('[fetch] Getting song lyrics...')
      console.log('[fetch] Getting song lyrics')
      const lyricsUrl = `${apiBaseUrl}/api/song/lyric?id=${encodeURIComponent(
        songId,
      )}&lv=-1`
      const lyricsResponse = await fetch(lyricsUrl)

      if (!lyricsResponse.ok) {
        throw new Error(
          `Lyrics request failed with status ${lyricsResponse.status}`,
        )
      }

      const lyricsPayload: unknown = await lyricsResponse.json()
      const rawLyrics = getLyricsText(lyricsPayload)
      setStepState('fetch', 'completed')
      log('[fetch] Lyrics received')
      console.log('[fetch] Lyrics received')

      activeStep = 'process'
      await yieldToBrowser()
      setStepState('process', 'loading')
      log('[process] Removing timestamps and line breaks...')
      console.log('[process] Parsing lyrics')
      const parsedLyrics = parseLyrics(rawLyrics)
      setStepState('process', 'completed')
      log('[process] Lyrics parsed')
      console.log('[process] Lyrics parsed')

      activeStep = 'convert'
      await yieldToBrowser()
      setStepState('convert', 'loading')
      log('[convert] Converting lyrics to wiki format...')
      console.log('[convert] Converting lyrics to wiki format')
      setOutputText(formatLyricsAsWiki(parsedLyrics))
      setStepState('convert', 'completed')
      log('[convert] Printed wiki format to Output')
      console.log('[convert] Printed wiki format to Output')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown workflow error'
      setStepState(activeStep, 'failed')
      setOutputText(`Lyrics Finder workflow failed:\n${message}`)
      log(`[${activeStep}] Failed: ${message}`)
      console.error(`[${activeStep}] Workflow step failed`, error)
    } finally {
      setStepState('cleanup', 'loading')
      log('[cleanup] Finishing lyrics workflow...')
      console.log('[cleanup] Finishing lyrics workflow')
      await yieldToBrowser()
      setStepState('cleanup', 'completed')
      log('[cleanup] Lyrics workflow finished')
      console.log('[cleanup] Lyrics workflow finished')
      setIsProcessing(false)
    }
  }

  const lyricsConsoleInfo: readonly ConsoleInfo[] = [
    { label: 'Source', value: 'Song name and artist' },
    { label: 'Mode', value: 'Lyrics wiki conversion workflow' },
    { label: 'Last event', value: lastEvent },
  ]

  return (
    <ToolPanel
      title="Lyrics Finder"
      panelId="lyrics-finder-panel"
      onClose={onClose}
    >
      <LyricsInput onStart={handleStart} disabled={isProcessing} />
      <section
        className="tool-panel__progress"
        aria-labelledby="lyrics-progress-title"
      >
        <h3 id="lyrics-progress-title">Progress</h3>
        <ProgressBar steps={progressSteps} ariaLabel="Lyrics finder progress" />
      </section>
      <Output text={outputText} />
      <Console
        debugText={consoleLines.join('\n')}
        additionalInfo={lyricsConsoleInfo}
      />
    </ToolPanel>
  )
}

export default LyricsFinderPanel
