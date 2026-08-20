export type AgentId =
  | 'planner'
  | 'flights'
  | 'hotels'
  | 'activities'
  | 'transfers'
  | 'budget'

export type AgentStatus = 'idle' | 'thinking' | 'transmitting' | 'done'

export type Point = { x: number; y: number }

export type Agent = {
  id: AgentId
  name: string
  role: string
  short: string
  size: number
  color: string
  desktop: Point
  mobile: Point
}

export type Projectile = {
  id: string
  from: AgentId
  to: AgentId
  born: number
  duration: number
}

export type SimEvent =
  | { at: number; kind: 'status'; agentId: AgentId; status: AgentStatus }
  | { at: number; kind: 'log'; agentId: AgentId; text: string }
  | { at: number; kind: 'send'; from: AgentId; to: AgentId }
  | { at: number; kind: 'focus'; agentId: AgentId }
  | { at: number; kind: 'complete' }

export type Playback = 'idle' | 'playing' | 'paused' | 'finished'
