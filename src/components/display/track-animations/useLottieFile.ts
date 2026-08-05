'use client'

import { useEffect, useState } from 'react'

export function useLottieFile(path: string) {
  const [data, setData] = useState<object | null>(null)
  useEffect(() => {
    fetch(path)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setData)
      .catch(() => {})
  }, [path])
  return data
}
