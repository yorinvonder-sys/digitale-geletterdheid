import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/* ---------------------------------- Eyes ---------------------------------- */
/* Googly eyes that follow the cursor — the brand's signature. */
export function Eyes({ size = 84, className = '' }: { size?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return
      const r = ref.current.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy) || 1
      const max = size * 0.11
      const pull = Math.min(dist / 18, max)
      setOffset({ x: (dx / dist) * pull, y: (dy / dist) * pull })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [size])

  const eye = (
    <div
      className="rounded-full border-[3px] border-ink bg-paper flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="rounded-full bg-ink transition-transform duration-100 ease-out"
        style={{
          width: size * 0.38,
          height: size * 0.38,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      />
    </div>
  )

  return (
    <div ref={ref} className={`flex items-center ${className}`} style={{ gap: size * 0.08 }}>
      {eye}
      {eye}
    </div>
  )
}

/* ---------------------------------- Duck ---------------------------------- */
/* The real DGSkills duck: graduation cap, lime beak. */
export function Duck({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand/duck-mark.webp"
      width={size}
      height={size}
      alt="De DGSkills eend"
      className={className}
      draggable={false}
    />
  )
}

/* ------------------------------ LogoLockup --------------------------------- */
/* Duck mark + wordmark, as used on the live site. */
export function LogoLockup({ height = 34, dark = false, className = '' }: { height?: number; dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/brand/duck-mark.webp"
        alt=""
        style={{ height, width: height }}
        draggable={false}
      />
      <span
        className={`font-display font-black ${dark ? 'text-paper' : 'text-ink'}`}
        style={{ fontSize: height * 0.62, letterSpacing: '-0.02em' }}
      >
        DGSkills
      </span>
    </span>
  )
}

/* --------------------------------- Marquee --------------------------------- */
export function Marquee({
  items,
  dark = false,
  className = '',
}: {
  items: string[]
  dark?: boolean
  className?: string
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-sm md:text-base font-bold tracking-[0.18em] uppercase">{it}</span>
          <span className="text-lg">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div
      className={`overflow-hidden py-3 border-y-[3px] border-ink ${
        dark ? 'bg-ink text-lime' : 'bg-lime text-ink'
      } ${className}`}
    >
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  )
}

/* ----------------------------------- Pill ----------------------------------- */
export function Pill({
  children,
  filled = false,
  dark = false,
  className = '',
}: {
  children: React.ReactNode
  filled?: boolean
  dark?: boolean
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] md:text-xs font-bold tracking-[0.16em] uppercase border-2 ${
        filled
          ? 'bg-lime border-ink text-ink'
          : dark
            ? 'border-paper/30 text-paper/80'
            : 'border-ink/60 text-ink/80'
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${filled ? 'bg-ink' : 'bg-lime-deep'}`} />
      {children}
    </span>
  )
}

/* ------------------------------- BrowserFrame ------------------------------- */
export function BrowserFrame({
  url,
  children,
  dark = false,
  className = '',
}: {
  url: string
  children: React.ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border-[3px] shadow-[8px_8px_0_0_rgba(23,20,14,1)] ${
        dark ? 'border-ink bg-ink-soft text-paper' : 'border-ink bg-white text-ink'
      } ${className}`}
    >
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b-[3px] ${dark ? 'border-paper/15' : 'border-ink/10'}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-lime-deep" />
        <span
          className={`ml-3 flex-1 truncate rounded-full px-3 py-1 text-[11px] font-medium ${
            dark ? 'bg-paper/10 text-paper/70' : 'bg-ink/5 text-ink/60'
          }`}
        >
          {url}
        </span>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  )
}

/* --------------------------------- Reveal ---------------------------------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------ ChapterMarker ------------------------------ */
export function ChapterMarker({
  kicker,
  number,
  title,
  dark = false,
}: {
  kicker: string
  number: string
  title: React.ReactNode
  dark?: boolean
}) {
  return (
    <div className="relative">
      <span
        className={`pointer-events-none select-none absolute -top-24 md:-top-40 right-0 font-display font-black text-[9rem] md:text-[15rem] leading-none ${
          dark ? 'chapter-watermark-light' : 'chapter-watermark'
        }`}
        aria-hidden
      >
        {number}
      </span>
      <Reveal>
        <Pill dark={dark}>{kicker}</Pill>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className={`mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight ${dark ? 'text-paper' : 'text-ink'}`}>
          {title}
        </h2>
      </Reveal>
    </div>
  )
}
