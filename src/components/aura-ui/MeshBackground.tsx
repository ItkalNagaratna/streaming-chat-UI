"use client"

import { useEffect, useRef } from "react"

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    opacity: number
    opacityDir: number
}

interface ShootingStar {
    x: number
    y: number
    len: number
    speed: number
    angle: number
    opacity: number
    active: boolean
}

const PARTICLE_COUNT = 90
const CONNECTION_DISTANCE = 140
const AURORA_COLORS: [number, number, number][] = [
    [59, 130, 246],   // blue
    [139, 92, 246],   // violet
    [168, 85, 247],   // purple
    [6, 182, 212],    // cyan
    [99, 102, 241],   // indigo
]

export function MeshBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let rafId: number
        let w = 0, h = 0

        const resize = () => {
            w = canvas.width = window.innerWidth
            h = canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // --- Particles ---
        const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            opacityDir: Math.random() > 0.5 ? 1 : -1,
        }))

        // --- Aurora Blobs ---
        const blobs = AURORA_COLORS.map((color, i) => ({
            x: (window.innerWidth / AURORA_COLORS.length) * i + Math.random() * 200,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.15,
            radius: Math.min(window.innerWidth, window.innerHeight) * (0.35 + Math.random() * 0.25),
            color,
        }))

        // --- Shooting Stars ---
        const shootingStars: ShootingStar[] = Array.from({ length: 4 }, () => ({
            x: 0, y: 0, len: 0, speed: 0, angle: 0, opacity: 0, active: false,
        }))

        const spawnShootingStar = (star: ShootingStar) => {
            star.x = Math.random() * w
            star.y = Math.random() * h * 0.5
            star.len = 80 + Math.random() * 120
            star.speed = 6 + Math.random() * 6
            star.angle = Math.PI / 5 + (Math.random() - 0.5) * 0.3
            star.opacity = 0.8 + Math.random() * 0.2
            star.active = true
        }

        // Stagger shooting star spawning
        setTimeout(() => spawnShootingStar(shootingStars[0]), 1200)
        setTimeout(() => spawnShootingStar(shootingStars[1]), 4800)
        setTimeout(() => spawnShootingStar(shootingStars[2]), 8000)
        setTimeout(() => spawnShootingStar(shootingStars[3]), 11500)

        let t = 0

        const draw = () => {
            t += 0.004
            ctx.clearRect(0, 0, w, h)

            // ── 1. Black base ──────────────────────────────────────────────────
            ctx.fillStyle = "#000008"
            ctx.fillRect(0, 0, w, h)

            // ── 2. Aurora blobs (screen blend) ────────────────────────────────
            ctx.save()
            ctx.globalCompositeOperation = "screen"
            blobs.forEach((blob, i) => {
                blob.x += blob.vx + Math.sin(t + i * 1.7) * 0.25
                blob.y += blob.vy + Math.cos(t + i * 1.1) * 0.2
                if (blob.x < -300) blob.x = w + 300
                if (blob.x > w + 300) blob.x = -300
                if (blob.y < -300) blob.y = h + 300
                if (blob.y > h + 300) blob.y = -300

                const r = blob.radius
                const grd = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r)
                const [rv, gv, bv] = blob.color
                grd.addColorStop(0, `rgba(${rv},${gv},${bv},0.18)`)
                grd.addColorStop(0.5, `rgba(${rv},${gv},${bv},0.07)`)
                grd.addColorStop(1, `rgba(${rv},${gv},${bv},0)`)
                ctx.fillStyle = grd
                ctx.fillRect(0, 0, w, h)
            })
            ctx.restore()

            // ── 3. Particle dots + connections ────────────────────────────────
            particles.forEach(p => {
                // drift
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0) p.x = w
                if (p.x > w) p.x = 0
                if (p.y < 0) p.y = h
                if (p.y > h) p.y = 0

                // twinkle
                p.opacity += 0.004 * p.opacityDir
                if (p.opacity > 0.7) p.opacityDir = -1
                if (p.opacity < 0.05) p.opacityDir = 1
            })

            // draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < CONNECTION_DISTANCE) {
                        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.18
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = `rgba(147,197,253,${alpha})`
                        ctx.lineWidth = 0.6
                        ctx.stroke()
                    }
                }
            }

            // draw dots
            particles.forEach(p => {
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(200,220,255,${p.opacity})`
                ctx.fill()
            })

            // ── 4. Shooting stars ─────────────────────────────────────────────
            shootingStars.forEach((star, idx) => {
                if (!star.active) return
                const tailX = star.x - Math.cos(star.angle) * star.len
                const tailY = star.y - Math.sin(star.angle) * star.len

                const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y)
                grad.addColorStop(0, `rgba(255,255,255,0)`)
                grad.addColorStop(1, `rgba(255,255,255,${star.opacity})`)

                ctx.beginPath()
                ctx.moveTo(tailX, tailY)
                ctx.lineTo(star.x, star.y)
                ctx.strokeStyle = grad
                ctx.lineWidth = 1.5
                ctx.stroke()

                // tiny bright head
                ctx.beginPath()
                ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${star.opacity})`
                ctx.fill()

                star.x += Math.cos(star.angle) * star.speed
                star.y += Math.sin(star.angle) * star.speed
                star.opacity -= 0.013

                if (star.opacity <= 0 || star.x > w + 100 || star.y > h + 100) {
                    star.active = false
                    // respawn after a random delay
                    setTimeout(() => spawnShootingStar(shootingStars[idx]), 4000 + Math.random() * 8000)
                }
            })

            // ── 5. Deep vignette ─────────────────────────────────────────────
            const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.15, w / 2, h / 2, h * 0.95)
            vig.addColorStop(0, "rgba(0,0,0,0)")
            vig.addColorStop(1, "rgba(0,0,0,0.82)")
            ctx.fillStyle = vig
            ctx.fillRect(0, 0, w, h)

            rafId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener("resize", resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    )
}
