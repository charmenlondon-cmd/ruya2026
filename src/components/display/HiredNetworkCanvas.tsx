'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Hire } from '@/types/database'

const TRACK_ANGLE_DEG: Record<string, number> = {
  'Engineering': 270,
  'Finance': 306,
  'Architecture & Design': 342,
  'Human Resources': 18,
  'IT': 54,
  'Legal & Compliance': 90,
  'Marketing': 126,
  'Operations & Supply Chain': 162,
  'Project Management': 198,
  'Sales & Business Development': 234,
}

const TRACK_COLOR: Record<string, string> = {
  'Engineering': '#60a5fa',
  'Finance': '#34d399',
  'Architecture & Design': '#f472b6',
  'Human Resources': '#fb923c',
  'IT': '#a78bfa',
  'Legal & Compliance': '#fbbf24',
  'Marketing': '#f87171',
  'Operations & Supply Chain': '#2dd4bf',
  'Project Management': '#e879f9',
  'Sales & Business Development': '#86efac',
}

const AVATAR_RADIUS = 26
const CLUSTER_RADIUS_RATIO = 0.38

interface HireNode extends d3.SimulationNodeDatum {
  id: string
  hire: Hire
  img: HTMLImageElement | null
}

interface Props {
  hires: Hire[]
}

export function HiredNetworkCanvas({ hires }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simulationRef = useRef<d3.Simulation<HireNode, never> | null>(null)
  const nodesRef = useRef<HireNode[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.parentElement?.offsetWidth ?? window.innerWidth
    canvas.height = canvas.parentElement?.offsetHeight ?? window.innerHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // Merge hires into nodes — preserve existing positions
    const existingById = new Map<string, HireNode>(
      nodesRef.current.map((n) => [n.id, n])
    )
    const newNodes: HireNode[] = hires.map((hire) => {
      const existing = existingById.get(hire.id)
      if (existing) return existing
      return {
        id: hire.id,
        hire,
        img: null,
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 20,
      }
    })
    nodesRef.current = newNodes

    // Preload avatar images for nodes with img === null
    for (const node of nodesRef.current) {
      if (node.img === null) {
        const img = new Image()
        img.src = '/avatars/' + node.hire.avatar_id + '.png'
        img.onload = () => {
          node.img = img
        }
      }
    }

    // Custom cluster force
    const clusterR = Math.min(cx, cy) * CLUSTER_RADIUS_RATIO
    const clusterForce = (alpha: number) => {
      for (const node of nodesRef.current) {
        const angleDeg = TRACK_ANGLE_DEG[node.hire.track] ?? 0
        const rad = (angleDeg * Math.PI) / 180
        const tx = cx + Math.cos(rad) * clusterR
        const ty = cy + Math.sin(rad) * clusterR
        node.vx = (node.vx ?? 0) + (tx - (node.x ?? cx)) * alpha * 0.45
        node.vy = (node.vy ?? 0) + (ty - (node.y ?? cy)) * alpha * 0.45
      }
    }

    // Set up or restart simulation
    if (simulationRef.current === null) {
      simulationRef.current = d3.forceSimulation<HireNode>()
    }

    const simulation = simulationRef.current
    simulation
      .nodes(nodesRef.current)
      .alpha(0.6)
      .restart()

    simulation
      .force('collision', d3.forceCollide<HireNode>(AVATAR_RADIUS + 3))
      .force('charge', d3.forceManyBody<HireNode>().strength(-20))
      .force('cluster', clusterForce)
      .force('center', d3.forceCenter(cx, cy).strength(0.04))

    simulation.on('tick', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const node of nodesRef.current) {
        const x = node.x ?? cx
        const y = node.y ?? cy

        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, AVATAR_RADIUS, 0, Math.PI * 2)
        ctx.clip()

        if (node.img) {
          ctx.drawImage(node.img, x - AVATAR_RADIUS, y - AVATAR_RADIUS, AVATAR_RADIUS * 2, AVATAR_RADIUS * 2)
        } else {
          ctx.fillStyle = TRACK_COLOR[node.hire.track] ?? '#ffffff'
          ctx.fill()
        }
        ctx.restore()

        // Coloured ring
        ctx.beginPath()
        ctx.arc(x, y, AVATAR_RADIUS, 0, Math.PI * 2)
        ctx.strokeStyle = TRACK_COLOR[node.hire.track] ?? '#ffffff'
        ctx.lineWidth = 3
        ctx.stroke()
      }
    })

    return () => {
      simulationRef.current?.stop()
    }
  }, [hires])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  )
}
