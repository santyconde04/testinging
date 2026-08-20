import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  a: number
  tw: number
  layer: number
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stars: Star[] = []
    let raf = 0
    let w = 0
    let h = 0

    const seed = () => {
      const count = Math.min(220, Math.floor((w * h) / 9000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.7 + 0.15,
        tw: Math.random() * Math.PI * 2,
        layer: Math.random() < 0.35 ? 0 : Math.random() < 0.7 ? 1 : 2,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX / w
      mouse.current.y = e.clientY / h
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const mx = (mouse.current.x - 0.5) * 18
      const my = (mouse.current.y - 0.5) * 12

      for (const s of stars) {
        const depth = s.layer === 0 ? 0.25 : s.layer === 1 ? 0.6 : 1
        const twinkle = 0.55 + Math.sin(t * 0.0016 + s.tw) * 0.45
        ctx.beginPath()
        ctx.fillStyle = `rgba(210, 245, 238, ${s.a * twinkle})`
        ctx.arc(s.x * w + mx * depth, s.y * h + my * depth, s.r * depth, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}
