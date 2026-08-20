import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { AGENTS, EDGES, layoutOf } from '../data/agents'
import type { Agent, AgentId, AgentStatus, Point, Projectile } from '../types'

type Props = {
  selected: AgentId | null
  statuses: Record<AgentId, AgentStatus>
  projectiles: Projectile[]
  simTime: number
  playing: boolean
  onSelect: (id: AgentId) => void
}

function useMobile(max = 760) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= max,
  )
  useEffect(() => {
    const on = () => setMobile(window.innerWidth <= max)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [max])
  return mobile
}

function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function center(agent: Agent, size: { w: number; h: number }, mobile: boolean): Point {
  const p = layoutOf(agent, mobile)
  return { x: (p.x / 100) * size.w, y: (p.y / 100) * size.h }
}

function quadPoint(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  }
}

function controlPoint(a: Point, b: Point, lift: number): Point {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  return { x: mx - (dy / len) * lift, y: my + (dx / len) * lift }
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function Constellation({
  selected,
  statuses,
  projectiles,
  simTime,
  playing,
  onSelect,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const mobile = useMobile()
  const size = useSize(stageRef)

  const points = useMemo(() => {
    const map = {} as Record<AgentId, Point>
    for (const agent of AGENTS) map[agent.id] = center(agent, size, mobile)
    return map
  }, [size, mobile])

  const paths = useMemo(() => {
    return EDGES.map(([from, to]) => {
      const a = points[from]
      const b = points[to]
      if (!a || !b) return null
      const lift = (from === 'planner' ? 36 : 22) * (mobile ? 0.55 : 1)
      const c = controlPoint(a, b, lift)
      return { from, to, a, b, c, d: `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}` }
    }).filter(Boolean) as {
      from: AgentId
      to: AgentId
      a: Point
      b: Point
      c: Point
      d: string
    }[]
  }, [points, mobile])

  const focused = selected !== null
  const live = new Set(
    AGENTS.filter((a) => statuses[a.id] === 'thinking' || statuses[a.id] === 'transmitting').map(
      (a) => a.id,
    ),
  )

  return (
    <div
      ref={stageRef}
      className={`constellation${playing ? ' is-live' : ''}`}
      aria-label="Grafo de agentes"
    >
      <svg
        className="constellation-svg"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${Math.max(size.w, 1)} ${Math.max(size.h, 1)}`}
        role="presentation"
      >
        <defs>
          <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {paths.map((p) => {
          const hot =
            live.has(p.from) ||
            live.has(p.to) ||
            projectiles.some(
              (pr) =>
                (pr.from === p.from && pr.to === p.to) ||
                (pr.from === p.to && pr.to === p.from),
            )
          return (
            <path
              key={`${p.from}-${p.to}`}
              d={p.d}
              className={`edge${hot ? ' is-hot' : ''}`}
              fill="none"
            />
          )
        })}

        {projectiles.map((pr) => {
          const p0 = points[pr.from]
          const p1 = points[pr.to]
          if (!p0 || !p1) return null
          const path = paths.find(
            (p) =>
              (p.from === pr.from && p.to === pr.to) ||
              (p.from === pr.to && p.to === pr.from),
          )
          const a = path?.a ?? p0
          const b = path?.b ?? p1
          const ctrl = path?.c ?? controlPoint(p0, p1, mobile ? 20 : 34)
          const reverse = Boolean(path && pr.from === path.to)
          const raw = easeInOut(Math.min(1, Math.max(0, (simTime - pr.born) / pr.duration)))
          const t = reverse ? 1 - raw : raw
          const pos = quadPoint(a, ctrl, b, t)
          const nextT = reverse ? Math.max(0, t - 0.02) : Math.min(1, t + 0.02)
          const next = quadPoint(a, ctrl, b, nextT)
          const angle = (Math.atan2(next.y - pos.y, next.x - pos.x) * 180) / Math.PI
          return (
            <g key={pr.id} transform={`translate(${pos.x} ${pos.y}) rotate(${angle})`}>
              <rect x="-10" y="-1.5" width="14" height="3" rx="1" fill="#f9a8d4" opacity="0.55" />
              <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#f472b6" />
              <rect x="-2" y="-2" width="4" height="4" rx="0.5" fill="#fff1f8" />
            </g>
          )
        })}
      </svg>

      {AGENTS.map((agent, i) => {
        const pos = layoutOf(agent, mobile)
        const status = statuses[agent.id]
        const isSel = selected === agent.id
        const dim = focused && !isSel
        const active = status === 'thinking' || status === 'transmitting'
        return (
          <button
            key={agent.id}
            type="button"
            className={[
              'node',
              isSel ? 'is-selected' : '',
              dim ? 'is-dim' : '',
              active ? 'is-active' : '',
              status === 'done' ? 'is-done' : '',
              agent.id === 'planner' ? 'is-core' : '',
            ].join(' ')}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: agent.size,
              height: agent.size,
              animationDelay: `${i * -0.55}s`,
              ['--node' as string]: agent.color,
            }}
            onClick={() => onSelect(agent.id)}
            aria-pressed={isSel}
            aria-label={`${agent.name}, ${agent.role}`}
          >
            <span className="node-ring" />
            <span className="node-core" />
            <span className="node-label">
              <strong>{agent.short}</strong>
              <em>{agent.role}</em>
            </span>
          </button>
        )
      })}
    </div>
  )
}
