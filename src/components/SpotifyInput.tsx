import { useState, type FormEvent } from 'react'
import './SpotifyInput.css'

interface SpotifyInputProps {
  onStart?: (spotifyLink: string) => void
  disabled?: boolean
}

function SpotifyInput({ onStart, disabled = false }: SpotifyInputProps) {
  const [spotifyLink, setSpotifyLink] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onStart?.(spotifyLink.trim())
  }

  return (
    <section className="spotify-input" aria-labelledby="spotify-input-title">
      <h3 id="spotify-input-title">Source</h3>
      <form className="spotify-input__form" onSubmit={handleSubmit}>
        <label className="spotify-input__label" htmlFor="spotify-link">
          Spotify Link
        </label>
        <div className="spotify-input__controls">
          <input
            className="spotify-input__field"
            id="spotify-link"
            name="spotifyLink"
            type="url"
            value={spotifyLink}
            onChange={(event) => setSpotifyLink(event.target.value)}
            placeholder="https://open.spotify.com/..."
            required
            disabled={disabled}
          />
          <button
            className="spotify-input__button"
            type="submit"
            disabled={disabled}
          >
            Start
          </button>
        </div>
      </form>
    </section>
  )
}

export default SpotifyInput
