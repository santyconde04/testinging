import { useEffect, useRef } from 'react'
import { AGENT_MAP } from '../data/agents'
import type { AgentId, AgentStatus, Playback } from '../types'

const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: 'en reposo',
  thinking: 'procesando',
  transmitting: 'transmitiendo',
  done: 'completo',
}

type Props = {
  agentId: AgentId
  status: AgentStatus
  text: string
  typing: boolean
  playback: Playback
  onClose: () => void
}

export function AgentPanel({ agentId, status, text, typing, playback, onClose }: Props) {
  const agent = AGENT_MAP[agentId]
  const scroller = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [text])

  const empty =
    !text &&
    (playback === 'idle' || playback === 'paused') &&
    status === 'idle'

  return (
    <aside className="agent-panel" role="dialog" aria-labelledby="agent-panel-title">
      <div className="agent-panel-chrome">
        <div className="agent-panel-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="agent-panel-path">órbita://{agentId}</p>
        <button type="button" className="agent-panel-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>

      <header className="agent-panel-head">
        <div>
          <p className="eyebrow">{agent.role}</p>
          <h2 id="agent-panel-title">{agent.name}</h2>
        </div>
        <span className={`status-pill is-${status}`}>
          <i />
          {STATUS_LABEL[status]}
        </span>
      </header>

      <pre ref={scroller} className="terminal" tabIndex={0}>
        {empty ? (
          <span className="terminal-idle">
            esperando tráfico en este nodo…
            {'\n'}inicia la simulación o espera un mensaje.
          </span>
        ) : (
          <>
            {text}
            {(typing || status === 'thinking' || status === 'transmitting') && (
              <span className="caret" aria-hidden="true">
                █
              </span>
            )}
          </>
        )}
      </pre>
    </aside>
  )
}
