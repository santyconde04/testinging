import { Starfield } from './components/Starfield'
import { Constellation } from './components/Constellation'
import { AgentPanel } from './components/AgentPanel'
import { useSimulation } from './hooks/useSimulation'
import type { Playback } from './types'

function ctaLabel(playback: Playback) {
  if (playback === 'playing') return 'Pausar'
  if (playback === 'paused') return 'Continuar'
  if (playback === 'finished') return 'Volver a orbitar'
  return 'Iniciar simulación'
}

export default function App() {
  const sim = useSimulation()
  const primary =
    sim.playback === 'playing'
      ? sim.pause
      : sim.play

  return (
    <div className="scene">
      <Starfield />
      <div className="nebula nebula-a" aria-hidden="true" />
      <div className="nebula nebula-b" aria-hidden="true" />
      <div className="nebula nebula-c" aria-hidden="true" />
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
          <p className="tagline">Seis agentes. Un itinerario. Una constelación.</p>
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
