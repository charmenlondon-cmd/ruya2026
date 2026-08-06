import Image from 'next/image'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-sm">
        <Image
          src="/logos/aaah-logo-white.png"
          alt="Abdulla Al Arif Holding"
          width={180}
          height={48}
          priority
          className="h-10 w-auto object-contain"
        />
      </header>
      <main>{children}</main>
    </>
  )
}
