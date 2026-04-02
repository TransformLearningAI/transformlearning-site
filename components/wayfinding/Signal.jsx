'use client'
import { useEffect, useRef } from 'react'

// The Pulse — a tiny sine wave showing engagement momentum
function Pulse({ momentum = 0, trend = 'steady' }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = 48, h = 20
    canvas.width = w * 2 // retina
    canvas.height = h * 2
    ctx.scale(2, 2)
    let offset = 0

    function draw() {
      ctx.clearRect(0, 0, w, h)
      ctx.beginPath()
      const amp = 2 + momentum * 6
      const freq = 0.15 + momentum * 0.1
      const speed = 0.02 + momentum * 0.04

      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin((x * freq) + offset) * amp
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }

      const color = momentum > 0.6 ? '#00A8A8' : momentum > 0.3 ? '#5F7691' : '#DDE5EF'
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.stroke()
      offset += speed
      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frameRef.current)
  }, [momentum])

  return (
    <div className="flex items-center gap-2">
      <canvas ref={canvasRef} style={{ width: 48, height: 20 }} />
      <span className="text-[10px] text-gray-400 font-medium hidden sm:block">
        {trend === 'rising' ? '↑ rising' : trend === 'cooling' ? '↓ cooling' : '→ steady'}
      </span>
    </div>
  )
}

// The Signal — one sentence of ambient intelligence
export default function Signal({ signal, pulse }) {
  const dotColor = signal?.urgency === 'attentive' ? '#FF6B4A' : '#00A8A8'

  return (
    <div className="flex items-center justify-between px-5 py-3 rounded-2xl mb-6"
         style={{ background: 'rgba(12,31,63,0.03)', border: '1px solid rgba(12,31,63,0.06)' }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}40` }} />
        <p className="text-sm text-gray-600 truncate">{signal?.message || 'Loading...'}</p>
      </div>
      <Pulse momentum={pulse?.momentum || 0} trend={pulse?.trend || 'steady'} />
    </div>
  )
}
