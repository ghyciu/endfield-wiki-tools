import './Console.css'

export interface ConsoleInfo {
  label: string
  value: string
}

interface ConsoleProps {
  debugText: string
  additionalInfo: readonly ConsoleInfo[]
}

function Console({ debugText, additionalInfo }: ConsoleProps) {
  return (
    <section className="console" aria-labelledby="console-title">
      <header className="console__header">
        <h3 id="console-title">Console</h3>
        <span className="console__status">Debug output</span>
      </header>
      <pre className="console__output" aria-label="Debug output">
        {debugText}
      </pre>
      <dl className="console__details">
        {additionalInfo.map((info) => (
          <div className="console__detail" key={info.label}>
            <dt>{info.label}</dt>
            <dd>{info.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default Console
