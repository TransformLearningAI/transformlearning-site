'use client'
import { useEffect, useRef } from 'react'

// Blog 1: Campus transforming — buildings with roots growing, community gathering
export function BeyondTheCollegeIllustration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#1a1a2e')
    sky.addColorStop(0.5, '#16213e')
    sky.addColorStop(1, '#0f3460')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)

    // Stars
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h * 0.5, 0.5 + Math.random(), 0, Math.PI * 2)
      ctx.fill()
    }

    // Ground
    ctx.fillStyle = '#1a4a30'
    ctx.beginPath()
    ctx.moveTo(0, h * 0.7)
    ctx.quadraticCurveTo(w * 0.3, h * 0.65, w * 0.5, h * 0.68)
    ctx.quadraticCurveTo(w * 0.7, h * 0.71, w, h * 0.67)
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.fill()

    // Building silhouettes (old campus)
    ctx.fillStyle = '#0C1F3F'
    // Main building
    ctx.fillRect(w * 0.15, h * 0.35, w * 0.18, h * 0.35)
    // Tower
    ctx.fillRect(w * 0.21, h * 0.22, w * 0.06, h * 0.13)
    // Triangle roof
    ctx.beginPath()
    ctx.moveTo(w * 0.21, h * 0.22)
    ctx.lineTo(w * 0.24, h * 0.15)
    ctx.lineTo(w * 0.27, h * 0.22)
    ctx.fill()
    // Side building
    ctx.fillRect(w * 0.36, h * 0.42, w * 0.12, h * 0.28)
    // Dorm
    ctx.fillRect(w * 0.52, h * 0.45, w * 0.1, h * 0.25)

    // Warm windows (lights on = life inside)
    ctx.fillStyle = '#F59E0B'
    const windows = [
      [0.17, 0.4], [0.2, 0.4], [0.23, 0.4], [0.26, 0.4], [0.29, 0.4],
      [0.17, 0.5], [0.2, 0.5], [0.26, 0.5], [0.29, 0.5],
      [0.17, 0.6], [0.23, 0.6], [0.26, 0.6],
      [0.38, 0.47], [0.41, 0.47], [0.44, 0.47],
      [0.38, 0.55], [0.41, 0.55],
      [0.54, 0.5], [0.57, 0.5],
      [0.54, 0.58], [0.57, 0.58],
    ]
    windows.forEach(([x, y]) => {
      ctx.fillStyle = `rgba(245,158,11,${0.6 + Math.random() * 0.4})`
      ctx.fillRect(w * x, h * y, w * 0.02, h * 0.05)
    })

    // Trees (new growth)
    const drawTree = (x, y, size) => {
      ctx.fillStyle = '#166534'
      ctx.beginPath()
      ctx.arc(w * x, h * y, size * 1.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#15803d'
      ctx.beginPath()
      ctx.arc(w * x - size * 0.4, h * y - size * 0.3, size * 0.8, 0, Math.PI * 2)
      ctx.fill()
      // Trunk
      ctx.fillStyle = '#78350f'
      ctx.fillRect(w * x - 1.5, h * y + size * 0.5, 3, size)
    }
    drawTree(0.08, 0.62, 8)
    drawTree(0.68, 0.58, 10)
    drawTree(0.75, 0.6, 7)
    drawTree(0.85, 0.57, 9)
    drawTree(0.92, 0.61, 6)

    // People silhouettes (community gathering)
    ctx.fillStyle = '#00A8A8'
    const people = [
      [0.4, 0.66], [0.43, 0.65], [0.46, 0.67], [0.49, 0.66],
      [0.52, 0.68], [0.55, 0.65], [0.58, 0.67], [0.61, 0.66],
      [0.64, 0.68], [0.37, 0.67],
    ]
    people.forEach(([x, y]) => {
      // Head
      ctx.beginPath()
      ctx.arc(w * x, h * y - 4, 2.5, 0, Math.PI * 2)
      ctx.fill()
      // Body
      ctx.fillRect(w * x - 1.5, h * y - 1, 3, 6)
    })

    // Glowing text area overlay
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.85, 0, w * 0.5, h * 0.85, w * 0.4)
    glow.addColorStop(0, 'rgba(0,168,168,0.15)')
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)

  }, [])

  return (
    <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
  )
}

// Blog 2: Board meeting — table with empty chairs, one light on
export function BoardNotHearingIllustration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Dark room
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.3, 20, w * 0.5, h * 0.3, w * 0.6)
    bg.addColorStop(0, '#1a1a2e')
    bg.addColorStop(1, '#0a0a15')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Overhead light cone
    ctx.fillStyle = 'rgba(245,158,11,0.06)'
    ctx.beginPath()
    ctx.moveTo(w * 0.45, h * 0.05)
    ctx.lineTo(w * 0.2, h * 0.95)
    ctx.lineTo(w * 0.8, h * 0.95)
    ctx.lineTo(w * 0.55, h * 0.05)
    ctx.fill()

    // Conference table
    ctx.fillStyle = '#2d1810'
    ctx.beginPath()
    ctx.ellipse(w * 0.5, h * 0.55, w * 0.32, h * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#3d2218'
    ctx.beginPath()
    ctx.ellipse(w * 0.5, h * 0.53, w * 0.32, h * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()

    // Chairs (most empty)
    const chairs = [0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78]
    chairs.forEach((x, i) => {
      ctx.fillStyle = i === 3 ? '#0C1F3F' : '#1a1a2e'
      ctx.beginPath()
      ctx.arc(w * x, h * 0.72, 6, 0, Math.PI * 2)
      ctx.fill()
      // Chair back
      ctx.fillRect(w * x - 4, h * 0.72 - 12, 8, 6)
    })

    // One person seated (center chair, lit)
    ctx.fillStyle = '#00A8A8'
    ctx.beginPath()
    ctx.arc(w * 0.48, h * 0.63, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(w * 0.48 - 3, h * 0.67, 6, 8)

    // Papers on table
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fillRect(w * 0.42, h * 0.48, 12, 8)
    ctx.fillRect(w * 0.56, h * 0.49, 10, 7)
    ctx.fillRect(w * 0.35, h * 0.5, 8, 6)

    // Question mark (floating, glowing)
    ctx.font = 'bold 36px serif'
    ctx.fillStyle = 'rgba(0,168,168,0.3)'
    ctx.textAlign = 'center'
    ctx.fillText('?', w * 0.5, h * 0.3)

    // Subtle glow around the question
    const qGlow = ctx.createRadialGradient(w * 0.5, h * 0.25, 5, w * 0.5, h * 0.25, 40)
    qGlow.addColorStop(0, 'rgba(0,168,168,0.1)')
    qGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = qGlow
    ctx.fillRect(w * 0.3, h * 0.1, w * 0.4, h * 0.35)

  }, [])

  return (
    <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
  )
}

// Blog 3: Split scene — empty building vs alive community campus
export function BuildingsTellingUsIllustration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Left half — cold, grey
    ctx.fillStyle = '#1e1e24'
    ctx.fillRect(0, 0, w * 0.5, h)
    // Right half — warm
    ctx.fillStyle = '#12253a'
    ctx.fillRect(w * 0.5, 0, w * 0.5, h)

    // Ground
    ctx.fillStyle = '#2a2a30'
    ctx.fillRect(0, h * 0.72, w * 0.5, h * 0.28)
    ctx.fillStyle = '#1a4a30'
    ctx.fillRect(w * 0.5, h * 0.72, w * 0.5, h * 0.28)

    // LEFT: Empty grey building
    ctx.fillStyle = '#3a3a42'
    ctx.fillRect(w * 0.08, h * 0.3, w * 0.32, h * 0.42)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = '#1a1a20'
        ctx.fillRect(w * (0.1 + c * 0.07), h * (0.34 + r * 0.12), w * 0.04, h * 0.07)
      }
    }
    ctx.fillStyle = '#8B0000'
    ctx.fillRect(w * 0.16, h * 0.66, w * 0.12, h * 0.04)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 6px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FOR SALE', w * 0.22, h * 0.688)

    // RIGHT: Same shape, alive
    ctx.fillStyle = '#2a4a5a'
    ctx.fillRect(w * 0.58, h * 0.3, w * 0.32, h * 0.42)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = 'rgba(245,158,11,' + (0.5 + Math.random() * 0.5) + ')'
        ctx.fillRect(w * (0.6 + c * 0.07), h * (0.34 + r * 0.12), w * 0.04, h * 0.07)
      }
    }
    ctx.fillStyle = '#00A8A8'
    ctx.fillRect(w * 0.62, h * 0.25, w * 0.24, h * 0.04)
    ctx.fillStyle = 'white'
    ctx.fillText('COMMUNITY CAMPUS', w * 0.74, h * 0.278)

    // People on right
    ctx.fillStyle = '#00A8A8';
    [[0.6,0.7],[0.65,0.69],[0.7,0.71],[0.75,0.7],[0.8,0.69],[0.85,0.71]].forEach(function(p) {
      ctx.beginPath(); ctx.arc(w*p[0], h*p[1]-3, 2, 0, Math.PI*2); ctx.fill()
      ctx.fillRect(w*p[0]-1, h*p[1]-1, 2, 5)
    })

    // Trees on right
    ctx.fillStyle = '#166534'
    ctx.beginPath(); ctx.arc(w*0.92, h*0.63, 7, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(w*0.55, h*0.65, 5, 0, Math.PI*2); ctx.fill()

    // Arrow
    ctx.fillStyle = '#00A8A8'
    ctx.beginPath()
    ctx.moveTo(w*0.47, h*0.5); ctx.lineTo(w*0.53, h*0.47); ctx.lineTo(w*0.53, h*0.49)
    ctx.lineTo(w*0.56, h*0.49); ctx.lineTo(w*0.56, h*0.51); ctx.lineTo(w*0.53, h*0.51)
    ctx.lineTo(w*0.53, h*0.53); ctx.fill()

  }, [])

  return (
    <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: '220px' }} />
  )
}
