'use client'

import { useSession } from '@/hooks/useSession'

export default function DisplayPage() {
  const { session, loading, error } = useSession()

  if (loading) return <div className="p-8 font-mono">Connecting...</div>
  if (error) return <div className="p-8 font-mono text-red-500">Error: {error}</div>
  if (!session) return <div className="p-8 font-mono">Waiting for game to start...</div>

  return (
    <div className="p-8 font-mono">
      <div className="text-sm text-gray-400 mb-2">Session: {session.id}</div>
      <div className="text-4xl font-bold">{session.state}</div>
      <div className="text-sm text-gray-400 mt-4">
        Lang: {session.language ?? '—'} |{' '}
        Player: {session.player_name ?? '—'} |{' '}
        Track: {session.track ?? '—'} |{' '}
        Score: {session.score}
      </div>
    </div>
  )
}
