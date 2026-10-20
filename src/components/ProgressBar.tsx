import './ProgressBar.css'

export type ProgressStepState = 'pending' | 'loading' | 'completed' | 'failed'

export interface ProgressStep {
  id: string
  label: string
  state: ProgressStepState
}

interface ProgressBarProps {
  steps: readonly ProgressStep[]
  ariaLabel?: string
}

function ProgressBar({
  steps,
  ariaLabel = 'Progress',
}: ProgressBarProps) {
  const completedSteps = steps.filter(
    (step) => step.state === 'completed',
  ).length

  return (
    <div
      className="progress-bar"
      aria-label={ariaLabel}
      aria-valuemax={steps.length}
      aria-valuemin={0}
      aria-valuenow={completedSteps}
      role="progressbar"
    >
      <ol className="progress-bar__steps">
        {steps.map((step, index) => (
          <li
            className={`progress-bar__step progress-bar__step--${step.state}`}
            key={step.id}
          >
            <span className="progress-bar__marker" aria-hidden="true">
              {step.state === 'completed' ? (
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="m4 8.5 2.5 2.5L12 5.5" />
                </svg>
              ) : step.state === 'failed' ? (
                <span className="progress-bar__failed-marker">!</span>
              ) : step.state === 'loading' ? (
                <span className="progress-bar__spinner" />
              ) : (
                <span className="progress-bar__pending-marker" />
              )}
            </span>
            <span className="progress-bar__label">{step.label}</span>
            {index < steps.length - 1 && (
              <span className="progress-bar__connector" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default ProgressBar
