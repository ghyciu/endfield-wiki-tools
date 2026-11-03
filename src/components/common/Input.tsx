import { useState, type FormEvent, type HTMLInputTypeAttribute } from 'react'
import './Input.css'

interface InputProps {
  sectionTitle: string
  label: string
  inputId: string
  name: string
  placeholder: string
  type?: HTMLInputTypeAttribute
  onStart?: (value: string) => void
  disabled?: boolean
}

function Input({
  sectionTitle,
  label,
  inputId,
  name,
  placeholder,
  type = 'text',
  onStart,
  disabled = false,
}: InputProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onStart?.(value.trim())
  }

  return (
    <section className="common-input" aria-labelledby={`${inputId}-title`}>
      <h3 id={`${inputId}-title`}>{sectionTitle}</h3>
      <form className="common-input__form" onSubmit={handleSubmit}>
        <label className="common-input__label" htmlFor={inputId}>
          {label}
        </label>
        <div className="common-input__controls">
          <input
            className="common-input__field"
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            required
            disabled={disabled}
          />
          <button
            className="common-input__button"
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

export default Input
