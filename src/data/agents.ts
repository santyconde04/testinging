import type { Agent, AgentId, Point } from '../types'

const planner: Agent = {
  id: 'planner',
  name: 'Planificador',
  role: 'Orquestador',
  short: 'Núcleo',
  size: 92,
  palette: {
    core: '#f4e4c1',
    mid: '#2a8f7a',
    rim: '#0b3d38',
    glow: 'rgba(94, 234, 212, 0.55)',
    atmosphere: 'rgba(45, 212, 191, 0.28)',
    band: 'rgba(8, 40, 38, 0.35)',
  },
  desktop: { x: 50, y: 48 },
  mobile: { x: 50, y: 44 },
}

const flights: Agent = {
  id: 'flights',
  name: 'Agente de vuelos',
  role: 'Especialista aéreo',
  short: 'Vuelos',
  size: 64,
  palette: {
    core: '#d7f6ff',
    mid: '#3aa0c2',
    rim: '#0b3a4a',
    glow: 'rgba(103, 232, 249, 0.45)',
    atmosphere: 'rgba(56, 189, 248, 0.22)',
    band: 'rgba(12, 48, 64, 0.4)',
  },
  desktop: { x: 22, y: 24 },
  mobile: { x: 16, y: 20 },
}

const hotels: Agent = {
  id: 'hotels',
  name: 'Agente de hoteles',
  role: 'Especialista de alojamiento',
  short: 'Hoteles',
  size: 64,
  palette: {
    core: '#ffe9c7',
    mid: '#3f9a7a',
    rim: '#123a2e',
    glow: 'rgba(52, 211, 153, 0.4)',
    atmosphere: 'rgba(16, 185, 129, 0.22)',
    band: 'rgba(14, 50, 38, 0.38)',
  },
  desktop: { x: 78, y: 24 },
  mobile: { x: 84, y: 20 },
}

const activities: Agent = {
  id: 'activities',
  name: 'Agente de actividades',
  role: 'Especialista experiencial',
  short: 'Actividades',
  size: 60,
  palette: {
    core: '#e8fff4',
    mid: '#2f8f88',
    rim: '#0d3533',
    glow: 'rgba(45, 212, 191, 0.42)',
    atmosphere: 'rgba(20, 184, 166, 0.2)',
    band: 'rgba(10, 42, 40, 0.4)',
  },
  desktop: { x: 16, y: 68 },
  mobile: { x: 16, y: 70 },
}

const transfers: Agent = {
  id: 'transfers',
  name: 'Agente de traslados internos',
  role: 'Especialista de movilidad',
  short: 'Traslados',
  size: 60,
  palette: {
    core: '#fff1d6',
    mid: '#4a8f6e',
    rim: '#16382c',
    glow: 'rgba(110, 231, 183, 0.38)',
    atmosphere: 'rgba(52, 211, 153, 0.18)',
    band: 'rgba(18, 48, 36, 0.4)',
  },
  desktop: { x: 84, y: 68 },
  mobile: { x: 84, y: 70 },
}

const budget: Agent = {
  id: 'budget',
  name: 'Agente de presupuesto',
  role: 'Reconciliación de costes',
  short: 'Presupuesto',
  size: 70,
  palette: {
    core: '#ffe7b0',
    mid: '#c4892a',
    rim: '#3d2a0e',
    glow: 'rgba(245, 185, 66, 0.5)',
    atmosphere: 'rgba(245, 185, 66, 0.2)',
    band: 'rgba(70, 42, 8, 0.35)',
  },
  desktop: { x: 50, y: 78 },
  mobile: { x: 50, y: 84 },
}

export const AGENTS: Agent[] = [
  flights,
  hotels,
  activities,
  transfers,
  budget,
  planner,
]

export const AGENT_MAP: Record<AgentId, Agent> = {
  planner,
  flights,
  hotels,
  activities,
  transfers,
  budget,
}

export const EDGES: [AgentId, AgentId][] = [
  ['planner', 'flights'],
  ['planner', 'hotels'],
  ['planner', 'activities'],
  ['planner', 'transfers'],
  ['planner', 'budget'],
  ['budget', 'flights'],
  ['budget', 'hotels'],
]

export function layoutOf(agent: Agent, mobile: boolean): Point {
  return mobile ? agent.mobile : agent.desktop
}
