import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ru'ya Careers Fair 2026",
    short_name: "Ru'ya",
    description: 'AAAH Interactive Careers Fair Game',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D5C6B',
    theme_color: '#0D5C6B',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
