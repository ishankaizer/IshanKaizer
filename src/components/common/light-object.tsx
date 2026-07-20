import { useEffect, useRef, useState } from 'react'

/**
 * A dark graphite form that lives in shadow until the cursor passes: the
 * pointer is a moving light, and the surfaces and edges nearest it catch a
 * diffuse highlight plus a red-pencil rim glow. Raymarched in a single raw
 * WebGL fragment shader, so it is self-hosted and adds no dependency.
 *
 * Robustness (see docs/animation.md): the loop pauses off-screen, honours
 * reduced motion (calm static reveal, no rotation), gives coarse pointers a
 * slow auto-orbit light so touch users still see it breathe, and falls back to
 * a plain dark panel if WebGL is unavailable or the context is lost. No page
 * content sits behind it, so it can never hide anything.
 */

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_mouse;   // -1..1, y up
uniform float u_time;
uniform float u_present;
uniform vec3 u_glow;

mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.0,s, 0.0,1.0,0.0, -s,0.0,c); }
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.0,0.0,0.0, 0.0,c,-s, 0.0,s,c); }

float sdRoundBox(vec3 p, vec3 b, float r){
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float map(vec3 p, float t){
  p = rotY(t*0.15) * rotX(t*0.11) * p;
  return sdRoundBox(p, vec3(0.62,0.62,0.62), 0.16);
}

vec3 calcNormal(vec3 p, float t){
  vec2 e = vec2(0.0012, 0.0);
  return normalize(vec3(
    map(p+e.xyy,t)-map(p-e.xyy,t),
    map(p+e.yxy,t)-map(p-e.yxy,t),
    map(p+e.yyx,t)-map(p-e.yyx,t)));
}

void main(){
  vec2 uv = (gl_FragCoord.xy*2.0 - u_res) / min(u_res.x, u_res.y);
  vec3 ro = vec3(0.0, 0.0, 3.0);
  vec3 rd = normalize(vec3(uv, -1.7));

  float t = 0.0;
  vec3 p;
  bool hit = false;
  for(int i=0;i<90;i++){
    p = ro + rd*t;
    float d = map(p, u_time);
    if(d < 0.001){ hit = true; break; }
    if(t > 6.5) break;
    t += d;
  }

  // the cursor light, floating in front of the form
  vec3 lp = vec3(u_mouse.x*2.3, u_mouse.y*1.7, 2.3);
  vec3 col = vec3(0.0);

  if(hit){
    vec3 n = calcNormal(p, u_time);
    vec3 L = lp - p;
    float dist = length(L);
    L /= dist;
    float atten = u_present / (1.0 + dist*dist*0.75);
    float diff = max(dot(n, L), 0.0);
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    col  = vec3(0.055, 0.055, 0.062) * 0.6;            // graphite, barely there
    col += diff * atten * vec3(0.92, 0.92, 0.98) * 1.7; // cursor diffuse
    col += fres * atten * u_glow * 2.4;                 // nearest edges glow
  } else {
    float g = u_present / (1.0 + dot(uv - u_mouse, uv - u_mouse) * 7.0);
    col += u_glow * g * 0.045;                          // faint halo in the void
  }

  col *= 1.0 - 0.28 * dot(uv, uv);                      // vignette
  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`

function brandRGB(): [number, number, number] {
  if (typeof window === 'undefined') return [1, 0.35, 0.27]
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()
  const m = raw.match(/^#?([0-9a-f]{6})$/i)
  if (!m) return [1, 0.35, 0.27]
  const n = parseInt(m[1], 16)
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
}

export function LightObject({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false })
    if (!gl) {
      setFailed(true)
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh))
        return null
      }
      return sh
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      setFailed(true)
      return
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true)
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uPresent = gl.getUniformLocation(prog, 'u_present')
    const uGlow = gl.getUniformLocation(prog, 'u_glow')
    gl.uniform3fv(uGlow, brandRGB())

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // pointer state, in -1..1 with y up, smoothed toward the target
    let tx = 0
    let ty = 0
    let mx = 0
    let my = 0
    let present = 0
    let targetPresent = fine ? 0.12 : 0.75
    const kick = () => {
      // reduced motion settles then stops the loop; a pointer event is
      // user-driven (not vestibular) motion, so restart it to track the cursor
      if (visible && raf === 0) raf = requestAnimationFrame(render)
    }
    const onMove = (e: PointerEvent) => {
      if (!fine) return
      const r = canvas.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 2 - 1
      ty = -(((e.clientY - r.top) / r.height) * 2 - 1)
      targetPresent = 1
      kick()
    }
    const onLeave = () => {
      if (!fine) return
      targetPresent = 0.12
      kick()
    }
    canvas.addEventListener('pointermove', onMove, { passive: true })
    canvas.addEventListener('pointerleave', onLeave)

    let visible = true
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && raf === 0) raf = requestAnimationFrame(render)
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    let lost = false
    const onLost = (e: Event) => {
      e.preventDefault()
      lost = true
      setFailed(true)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    const start = performance.now()
    let raf = 0
    const render = () => {
      raf = 0
      if (!visible || lost) return
      const now = (performance.now() - start) / 1000
      const time = reduce ? 0 : now

      if (!fine) {
        // coarse pointer: a slow auto-orbit light so it still breathes
        tx = reduce ? 0.35 : Math.cos(now * 0.5) * 0.7
        ty = reduce ? 0.25 : Math.sin(now * 0.4) * 0.55
      }
      // smoothing (snaps under reduced motion)
      const k = reduce ? 1 : 0.12
      mx += (tx - mx) * k
      my += (ty - my) * k
      present += (targetPresent - present) * (reduce ? 1 : 0.06)

      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, mx, my)
      gl.uniform1f(uTime, time)
      gl.uniform1f(uPresent, present)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // reduced motion resolves to a single settled frame, then stops
      if (reduce && Math.abs(present - targetPresent) < 0.001) return
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  if (failed) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          background:
            'radial-gradient(60% 60% at 50% 45%, color-mix(in oklab, var(--brand) 22%, #0b0b0d), #08080a 80%)',
        }}
      />
    )
  }

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
