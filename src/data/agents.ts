import type { Agent, AgentId, Point } from '../types'

const planner: Agent = {
  id: 'planner',
  name: 'Planificador',
  role: 'Orquestador',
  short: 'Núcleo',
  size: 54,
  color: '#22d3ee',
  desktop: { x: 50, y: 48 },
  mobile: { x: 50, y: 44 },
}

const flights: Agent = {
  id: 'flights',
  name: 'Agente de vuelos',
  role: 'Especialista aéreo',
  short: 'Vuelos',
  size: 38,
  color: '#38bdf8',
  desktop: { x: 22, y: 24 },
  mobile: { x: 16, y: 20 },
}

const hotels: Agent = {
  id: 'hotels',
  name: 'Agente de hoteles',
  role: 'Especialista de alojamiento',
  short: 'Hoteles',
  size: 38,
  color: '#34d399',
  desktop: { x: 78, y: 24 },
  mobile: { x: 84, y: 20 },
}

const activities: Agent = {
  id: 'activities',
  name: 'Agente de actividades',
  role: 'Especialista experiencial',
  short: 'Actividades',
  size: 36,
  color: '#2dd4bf',
  desktop: { x: 16, y: 68 },
  mobile: { x: 16, y: 70 },
}

const transfers: Agent = {
  id: 'transfers',
  name: 'Agente de traslados internos',
  role: 'Especialista de movilidad',
  short: 'Traslados',
  size: 36,
  color: '#4ade80',
  desktop: { x: 84, y: 68 },
  mobile: { x: 84, y: 70 },
}

const budget: Agent = {
  id: 'budget',
  name: 'Agente de presupuesto',
  role: 'Reconciliación de costes',
  short: 'Presupuesto',
  size: 42,
  color: '#f472b6',
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
