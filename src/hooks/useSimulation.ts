import { useCallback, useEffect, useRef, useState } from 'react'
import { AGENTS } from '../data/agents'
import { SCRIPT } from '../data/script'
import type { AgentId, AgentStatus, Playback, Projectile } from '../types'

const CHARS_PER_SEC = 52
const PROJECTILE_MS = 1080

type StatusMap = Record<AgentId, AgentStatus>
type TextMap = Record<AgentId, string>
type LenMap = Record<AgentId, number>

function emptyStatus(): StatusMap {
  return Object.fromEntries(AGENTS.map((a) => [a.id, 'idle'])) as StatusMap
}

function emptyText(): TextMap {
  return Object.fromEntries(AGENTS.map((a) => [a.id, ''])) as TextMap
}

function emptyLen(): LenMap {
  return Object.fromEntries(AGENTS.map((a) => [a.id, 0])) as LenMap
}

export function useSimulation() {
  const [playback, setPlayback] = useState<Playback>('idle')
  const [selected, setSelected] = useState<AgentId | null>(null)
  const [locked, setLocked] = useState(false)
  const [statuses, setStatuses] = useState<StatusMap>(emptyStatus)
  const [fullText, setFullText] = useState<TextMap>(emptyText)
  const [visibleLen, setVisibleLen] = useState<LenMap>(emptyLen)
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [simTime, setSimTime] = useState(0)

  const playbackRef = useRef(playback)
  const simTimeRef = useRef(0)
  const cursorRef = useRef(0)
  const fullTextRef = useRef(emptyText())
  const visibleRef = useRef(emptyLen())
  const lockedRef = useRef(false)
  const projectileId = useRef(0)
  const raf = useRef<number>(0)
  const lastTs = useRef<number | null>(null)

  useEffect(() => {
    playbackRef.current = playback
  }, [playback])

  useEffect(() => {
    lockedRef.current = locked
  }, [locked])

  const resetInternal = useCallback(() => {
    simTimeRef.current = 0
    cursorRef.current = 0
    fullTextRef.current = emptyText()
    visibleRef.current = emptyLen()
    lastTs.current = null
    setSimTime(0)
    setStatuses(emptyStatus())
    setFullText(emptyText())
    setVisibleLen(emptyLen())
    setProjectiles([])
    setLocked(false)
  }, [])

  useEffect(() => {
    const tick = (ts: number) => {
      const playing = playbackRef.current === 'playing'
      if (!playing) {
        lastTs.current = ts
        raf.current = requestAnimationFrame(tick)
        return
      }

      const prev = lastTs.current ?? ts
      lastTs.current = ts
      const dt = Math.min(ts - prev, 48)
      simTimeRef.current += dt
      const now = simTimeRef.current
      setSimTime(now)

      let focus: AgentId | null = null
      const statusPatch: Partial<StatusMap> = {}
      let logsChanged = false
      const born: Projectile[] = []

      while (
        cursorRef.current < SCRIPT.length &&
        SCRIPT[cursorRef.current].at <= now
      ) {
        const event = SCRIPT[cursorRef.current]
        cursorRef.current += 1

        if (event.kind === 'status') {
          statusPatch[event.agentId] = event.status
        } else if (event.kind === 'log') {
          fullTextRef.current = {
            ...fullTextRef.current,
            [event.agentId]:
              fullTextRef.current[event.agentId] + event.text + '\n',
          }
          logsChanged = true
          if (!lockedRef.current) focus = event.agentId
        } else if (event.kind === 'send') {
          projectileId.current += 1
          born.push({
            id: `p-${projectileId.current}`,
            from: event.from,
            to: event.to,
            born: now,
            duration: PROJECTILE_MS,
          })
          statusPatch[event.from] = 'transmitting'
          statusPatch[event.to] = 'thinking'
          if (!lockedRef.current) focus = event.to
        } else if (event.kind === 'focus') {
          if (!lockedRef.current) focus = event.agentId
        } else if (event.kind === 'complete') {
          setPlayback('finished')
          playbackRef.current = 'finished'
        }
      }

      if (Object.keys(statusPatch).length) {
        setStatuses((s) => ({ ...s, ...statusPatch }))
      }
      if (logsChanged) setFullText({ ...fullTextRef.current })
      if (focus) setSelected(focus)

      const chars = (dt / 1000) * CHARS_PER_SEC
      let typed = false
      const nextLen = { ...visibleRef.current }
      for (const agent of AGENTS) {
        const target = fullTextRef.current[agent.id].length
        if (nextLen[agent.id] < target) {
          nextLen[agent.id] = Math.min(target, nextLen[agent.id] + chars)
          typed = true
        }
      }
      if (typed) {
        visibleRef.current = nextLen
        setVisibleLen({ ...nextLen })
      }

      if (born.length) {
        setProjectiles((list) => [...list, ...born])
      }
      setProjectiles((list) => list.filter((p) => now - p.born < p.duration + 80))

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const play = useCallback(() => {
    if (playbackRef.current === 'finished' || playbackRef.current === 'idle') {
      resetInternal()
    }
    setPlayback('playing')
  }, [resetInternal])

  const pause = useCallback(() => {
    if (playbackRef.current === 'playing') setPlayback('paused')
  }, [])

  const reset = useCallback(() => {
    resetInternal()
    setPlayback('idle')
    setSelected(null)
  }, [resetInternal])

  const selectAgent = useCallback((id: AgentId) => {
    setSelected(id)
    setLocked(true)
  }, [])

  const clearSelection = useCallback(() => {
    setSelected(null)
    setLocked(false)
  }, [])

  const visibleText = Object.fromEntries(
    AGENTS.map((a) => [a.id, fullText[a.id].slice(0, Math.floor(visibleLen[a.id]))]),
  ) as TextMap

  const typing = AGENTS.some(
    (a) => visibleLen[a.id] < fullText[a.id].length && playback === 'playing',
  )

  return {
    playback,
    selected,
    locked,
    statuses,
    visibleText,
    projectiles,
    simTime,
    typing,
    play,
    pause,
    reset,
    selectAgent,
    clearSelection,
  }
}
