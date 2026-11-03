import { useState } from 'react'
import './Output.css'

interface OutputProps {
  text: string
}

function Output({ text }: OutputProps) {
  const [copyStatus, setCopyStatus] = useState<
    'idle' | 'copied' | 'error'
  >('idle')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  const copyLabel =
    copyStatus === 'copied'
      ? 'Copied'
      : copyStatus === 'error'
        ? 'Copy failed'
        : 'Copy'

  return (
    <section className="output" aria-labelledby="output-title">
      <header className="output__header">
        <h3 id="output-title">Output</h3>
        <button
          className="output__copy"
          type="button"
          onClick={handleCopy}
          aria-describedby="output-copy-status"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="6.5" y="6.5" width="9" height="9" rx="1.5" />
            <path d="M13.5 6.5V5A1.5 1.5 0 0 0 12 3.5H5A1.5 1.5 0 0 0 3.5 5v7A1.5 1.5 0 0 0 5 13.5h1.5" />
          </svg>
          {copyLabel}
        </button>
      </header>
      <pre className="output__text">{text}</pre>
      <span
        className={`output__status output__status--${copyStatus}`}
        id="output-copy-status"
        aria-live="polite"
      >
        {copyStatus === 'error' ? 'Unable to copy output.' : ''}
      </span>
    </section>
  )
}

export default Output
