'use client';

import { useEffect, useRef } from 'react';

import {
  LOGO_ACCENT_COLOR,
  LOGO_ACCENT_PATH,
  LOGO_MAIN_PATH,
  LOGO_VIEWBOX,
} from '@/lib/logo';

import styles from './DotFieldBackground.module.scss';

const MASK_SIZE = 160;
const TAU = Math.PI * 2;

type Ripple = {
  x: number;
  y: number;
  r: number;
  speed: number;
  maxR: number;
  width: number;
  strength: number;
  lights: boolean;
};

function renderMask(path: string): Uint8Array {
  const alpha = new Uint8Array(MASK_SIZE * MASK_SIZE);
  const canvas = document.createElement('canvas');
  canvas.width = MASK_SIZE;
  canvas.height = MASK_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) return alpha;

  const scale = MASK_SIZE / LOGO_VIEWBOX;
  ctx.scale(scale, scale);
  ctx.fill(new Path2D(path), 'evenodd');

  const { data } = ctx.getImageData(0, 0, MASK_SIZE, MASK_SIZE);
  for (let i = 0; i < alpha.length; i += 1) alpha[i] = data[i * 4 + 3];

  return alpha;
}

function readColors() {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(name).trim();

  return {
    muted: read('--muted-foreground'),
    foreground: read('--foreground'),
    brand: read('--brand-foreground'),
  };
}

export default function DotFieldBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrapper || !canvas || !ctx) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const mainMask = renderMask(LOGO_MAIN_PATH);
    const accentMask = renderMask(LOGO_ACCENT_PATH);

    let width = 0;
    let height = 0;
    let count = 0;
    let logoSize = 0;

    let hx = new Float32Array(0);
    let hy = new Float32Array(0);
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let glow = new Float32Array(0);
    let kind = new Uint8Array(0);

    let colors = readColors();
    let raf = 0;
    let resizeRaf = 0;
    let lastFrame = 0;
    let lastMove = -Infinity;
    let hasPointer = false;
    let introDone = false;

    const target = { x: 0, y: 0 };
    const focus = { x: 0, y: 0 };
    const ripples: Ripple[] = [];

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = width < 640 ? 13 : 16;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      count = cols * rows;
      hx = new Float32Array(count);
      hy = new Float32Array(count);
      px = new Float32Array(count);
      py = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      glow = new Float32Array(count);
      kind = new Uint8Array(count);

      logoSize = Math.min(width * 0.92, height * 0.9, 640);
      const left = width / 2 - logoSize / 2;
      const top = height / 2 - logoSize / 2;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const i = row * cols + col;
          const x = offsetX + col * spacing;
          const y = offsetY + row * spacing;

          hx[i] = px[i] = x;
          hy[i] = py[i] = y;

          const u = Math.floor(((x - left) / logoSize) * MASK_SIZE);
          const v = Math.floor(((y - top) / logoSize) * MASK_SIZE);

          if (u >= 0 && u < MASK_SIZE && v >= 0 && v < MASK_SIZE) {
            const index = v * MASK_SIZE + u;
            kind[i] = accentMask[index] > 110 ? 2 : mainMask[index] > 110 ? 1 : 0;
          }
        }
      }

      if (focus.x === 0 && focus.y === 0) {
        target.x = focus.x = width / 2;
        target.y = focus.y = height / 2;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.globalAlpha = 0.2;
      ctx.fillStyle = colors.muted;
      for (let i = 0; i < count; i += 1) {
        if (glow[i] < 0.02) ctx.fillRect(px[i] - 0.8, py[i] - 0.8, 1.6, 1.6);
      }

      for (let i = 0; i < count; i += 1) {
        const g = glow[i];
        if (g < 0.02) continue;

        const k = kind[i];
        ctx.globalAlpha = Math.min(1, 0.2 + g * (k === 0 ? 0.6 : 0.85));
        ctx.fillStyle =
          k === 2 ? LOGO_ACCENT_COLOR : k === 1 ? colors.foreground : colors.brand;

        ctx.beginPath();
        ctx.arc(px[i], py[i], 0.8 + g * (k === 0 ? 1.1 : 1.7), 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const addRipple = (ripple: Partial<Ripple> & { x: number; y: number }) => {
      ripples.push({
        r: 0,
        speed: 9,
        maxR: 520,
        width: 46,
        strength: 1,
        lights: false,
        ...ripple,
      });

      if (ripples.length > 5) ripples.shift();
    };

    const update = (time: number, step: number) => {
      if (!introDone && time > 300) {
        introDone = true;
        addRipple({
          x: width / 2,
          y: height / 2,
          speed: 8,
          maxR: logoSize * 0.85,
          width: 90,
          strength: 0.7,
          lights: true,
        });
      }

      const idle = !hasPointer || time - lastMove > 2500;
      if (idle) {
        target.x = width * (0.5 + 0.34 * Math.sin(time * 0.00055));
        target.y = height * (0.5 + 0.3 * Math.sin(time * 0.00083 + 1.3));
      }

      const ease = 1 - Math.pow(0.86, step);
      focus.x += (target.x - focus.x) * ease;
      focus.y += (target.y - focus.y) * ease;

      for (let r = ripples.length - 1; r >= 0; r -= 1) {
        ripples[r].r += ripples[r].speed * step;
        if (ripples[r].r >= ripples[r].maxR) ripples.splice(r, 1);
      }

      const repelR = idle ? 105 : 135;
      const revealR = idle ? 170 : 190;
      const repelStrength = idle ? 2.4 : 3.4;
      const revealR2 = revealR * revealR;

      const damping = Math.pow(0.84, step);
      const decayBase = Math.pow(0.955, step);
      const decayLogo = Math.pow(0.986, step);

      for (let i = 0; i < count; i += 1) {
        const k = kind[i];
        let g = glow[i];
        let ax = 0;
        let ay = 0;

        const dx = px[i] - focus.x;
        const dy = py[i] - focus.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < revealR2) {
          const d = Math.sqrt(d2);
          const reveal = (1 - d / revealR) * (k === 0 ? 0.75 : 1);
          if (reveal > g) g = reveal;

          if (d < repelR) {
            const s = 1 - d / repelR;
            const inv = (s * s * repelStrength) / (d || 1);
            ax += dx * inv;
            ay += dy * inv;
          }
        }

        for (let r = 0; r < ripples.length; r += 1) {
          const ripple = ripples[r];
          const rx = hx[i] - ripple.x;
          const ry = hy[i] - ripple.y;
          const rd = Math.sqrt(rx * rx + ry * ry);
          const band = Math.abs(rd - ripple.r);

          if (band < ripple.width) {
            const force =
              (1 - band / ripple.width) * ripple.strength * (1 - ripple.r / ripple.maxR);
            const inv = (force * 3.2) / (rd || 1);
            ax += rx * inv;
            ay += ry * inv;
            if (force * 0.9 > g) g = force * 0.9;
          }

          if (ripple.lights && k > 0 && rd < ripple.r) g = 1;
        }

        vx[i] = (vx[i] + ax * step + (hx[i] - px[i]) * 0.055 * step) * damping;
        vy[i] = (vy[i] + ay * step + (hy[i] - py[i]) * 0.055 * step) * damping;
        px[i] += vx[i] * step;
        py[i] += vy[i] * step;

        const displacement = Math.abs(px[i] - hx[i]) + Math.abs(py[i] - hy[i]);
        const displacedGlow = Math.min(displacement * 0.025, 0.65);
        if (displacedGlow > g) g = displacedGlow;

        glow[i] = g * (k > 0 ? decayLogo : decayBase);
      }

      wrapper.style.setProperty('--x', `${focus.x}px`);
      wrapper.style.setProperty('--y', `${focus.y}px`);
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);

      const step = lastFrame ? Math.min((time - lastFrame) / 16.667, 2.5) : 1;
      lastFrame = time;

      update(time, step);
      draw();
    };

    const drawStatic = () => {
      for (let i = 0; i < count; i += 1) glow[i] = kind[i] > 0 ? 0.9 : 0;
      draw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      hasPointer = true;
      lastMove = performance.now();
    };

    const handlePointerDown = (event: PointerEvent) => {
      handlePointerMove(event);
      addRipple({ x: event.clientX, y: event.clientY });
    };

    const handlePointerLeave = () => {
      hasPointer = false;
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        build();
        if (reducedMotion) drawStatic();
      });
    };

    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      if (reducedMotion) drawStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('resize', handleResize);
    build();

    if (reducedMotion) {
      drawStatic();
    } else {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerdown', handlePointerDown, { passive: true });
      document.documentElement.addEventListener('pointerleave', handlePointerLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      themeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.background} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}