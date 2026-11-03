import Input from '../common/Input'

interface LyricsInputProps {
  onStart?: (searchText: string) => void
  disabled?: boolean
}

function LyricsInput({ onStart, disabled = false }: LyricsInputProps) {
  return (
    <Input
      sectionTitle="Search"
      label="Name and Artist"
      inputId="lyrics-search"
      name="lyricsSearch"
      placeholder="Enter a song name and artist"
      onStart={onStart}
      disabled={disabled}
    />
  )
}

export default LyricsInput
