import { GridField } from './components/GridField'
import { Constellation } from './components/Constellation'
import { AgentPanel } from './components/AgentPanel'
import { useSimulation } from './hooks/useSimulation'
import type { Playback } from './types'

function ctaLabel(playback: Playback) {
  if (playback === 'playing') return 'Pausar'
  if (playback === 'paused') return 'Continuar'
  if (playback === 'finished') return 'Volver a ejecutar'
  return 'Iniciar simulación'
}

export default function App() {
  const sim = useSimulation()
  const primary = sim.playback === 'playing' ? sim.pause : sim.play

  return (
    <div className="scene">
      <GridField />
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Constellation
        selected={sim.selected}
        statuses={sim.statuses}
        projectiles={sim.projectiles}
        simTime={sim.simTime}
        playing={sim.playback === 'playing'}
        onSelect={sim.selectAgent}
      />

      <header className="hero">
        <div className="brand-block">
          <p className="brand">ÓRBITA</p>
          <p className="tagline">Grafo multiagente · tráfico en tiempo real</p>
        </div>

        <div className="hero-actions">
          <button type="button" className="cta" onClick={primary}>
            {ctaLabel(sim.playback)}
          </button>
          {sim.playback !== 'idle' && (
            <button type="button" className="ghost" onClick={sim.reset}>
              Reiniciar
            </button>
          )}
        </div>
      </header>

      {sim.selected && (
        <AgentPanel
          agentId={sim.selected}
          status={sim.statuses[sim.selected]}
          text={sim.visibleText[sim.selected]}
          typing={sim.typing}
          playback={sim.playback}
          onClose={sim.clearSelection}
        />
      )}
    </div>
  )
}
