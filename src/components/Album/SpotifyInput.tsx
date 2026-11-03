import Input from '../common/Input'

interface SpotifyInputProps {
  onStart?: (spotifyLink: string) => void
  disabled?: boolean
}

function SpotifyInput({ onStart, disabled = false }: SpotifyInputProps) {
  return (
    <Input
      sectionTitle="Source"
      label="Spotify Link"
      inputId="spotify-link"
      name="spotifyLink"
      type="url"
      placeholder="https://open.spotify.com/..."
      onStart={onStart}
      disabled={disabled}
    />
  )
}

export default SpotifyInput
