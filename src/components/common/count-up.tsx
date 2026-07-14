import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Counts from zero up to the number inside `value` when scrolled into view,
 * preserving any prefix/suffix (e.g. "68%"). Shows the final value at once
 * under prefers-reduced-motion.
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: string
  duration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const parsed = value.match(/^(\D*)(\d[\d,]*)(.*)$/)
  const prefix = parsed?.[1] ?? ''
  const target = parsed ? Number(parsed[2].replace(/,/g, '')) : NaN
  const suffix = parsed?.[3] ?? ''
  const animatable = Boolean(parsed) && !Number.isNaN(target)

  const [text, setText] = useState(() =>
    reduce || !animatable ? value : `${prefix}0${suffix}`,
  )
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (reduce || !animatable) {
      setText(value)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setText(`${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, prefix, suffix, target, duration, reduce, animatable])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
