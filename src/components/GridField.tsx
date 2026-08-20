import { useEffect, useRef } from 'react'

/** Subtle perspective grid + scanline HUD backdrop. */
export function GridField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let offset = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      offset = (offset + 0.35) % 40

      // Floor-ish perspective grid in lower half
      const horizon = h * 0.42
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, horizon, w, h - horizon)
      ctx.clip()

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.07)'
      ctx.lineWidth = 1

      for (let i = 0; i < 28; i++) {
        const t = i / 27
        const y = horizon + Math.pow(t, 1.65) * (h - horizon) + (offset * 0.4) % 18
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const vanishingX = w * 0.5
      for (let i = -18; i <= 18; i++) {
        const xEdge = vanishingX + i * (w / 14)
        ctx.beginPath()
        ctx.moveTo(vanishingX, horizon)
        ctx.lineTo(xEdge, h)
        ctx.stroke()
      }
      ctx.restore()

      // Upper HUD grid
      const step = 48
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.045)'
      for (let x = 0; x < w; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, horizon)
        ctx.stroke()
      }
      for (let y = 0; y < horizon; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Soft scanline
      const scanY = ((Date.now() / 18) % (h + 80)) - 40
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40)
      grad.addColorStop(0, 'rgba(34, 211, 238, 0)')
      grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.04)')
      grad.addColorStop(1, 'rgba(34, 211, 238, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 40, w, 80)

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="gridfield" aria-hidden="true" />
}
