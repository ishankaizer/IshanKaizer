import { useEffect, useRef } from 'react'

/**
 * A two-part circular cursor: a precise inner dot and a trailing ring that
 * follows with mechanical smoothing and grows over interactive elements.
 * Both use mix-blend-difference so they read on any background. Fine-pointer
 * only, snaps instantly under reduced-motion, native cursor untouched with
 * JS off.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let rx = tx
    let ry = ty
    let dx = tx
    let dy = ty
    let raf = 0

    const render = () => {
      const kr = reduce ? 1 : 0.18
      const kd = reduce ? 1 : 0.45
      rx += (tx - rx) * kr
      ry += (ty - ry) * kr
      dx += (tx - dx) * kd
      dy += (ty - dy) * kd
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const interactive =
      'a, button, [role="button"], [data-cursor="grow"], input, textarea, select, label'
    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      // Always restore visibility so the cursor reappears after leaving.
      ring.style.opacity = '1'
      dot.style.opacity = '1'
      const target = e.target as Element | null
      ring.dataset.hover = target?.closest?.(interactive) ? 'true' : 'false'
    }
    const onLeave = () => {
      ring.style.opacity = '0'
      dot.style.opacity = '0'
    }
    const onDown = () => (ring.dataset.down = 'true')
    const onUp = () => (ring.dataset.down = 'false')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      root.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden style={{ opacity: 0 }} />
      <div ref={dotRef} className="cursor-dot" aria-hidden style={{ opacity: 0 }} />
    </>
  )
}
