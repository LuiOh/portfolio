"use client";

// 풀스크린 고정 OGL Particles 배경
import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

type Props = {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  alphaParticles?: boolean;
  particleColors?: string[];
  moveOnHover?: boolean;
  hoverFactor?: number;
  disableRotation?: boolean;
  className?: string;
};

const VERTEX_SHADER = `attribute vec3 position;
attribute vec4 random;
attribute vec3 color;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;
varying vec4 vRandom;
varying vec3 vColor;
void main() {
  vRandom = random;
  vColor = color;
  vec3 pos = position * uSpread;
  pos.z *= 10.0;
  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
  vec4 mvPos = viewMatrix * mPos;
  gl_PointSize = uSizeRandomness == 0.0
    ? uBaseSize
    : (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}`;

const FRAGMENT_SHADER = `precision highp float;
uniform float uTime;
uniform float uAlphaParticles;
varying vec4 vRandom;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if(uAlphaParticles < 0.5) {
    if(d > 0.5) discard;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
  } else {
    float circle = smoothstep(0.5, 0.4, d) * 0.8;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
  }
}`;

const DEFAULT_COLORS = ["#ffffff", "#a5b4fc", "#93c5fd", "#c4b5fd", "#7dd3fc"];

// hex(#rrggbb) → [r, g, b] (0..1)
function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return [1, 1, 1];
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b];
}

export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  alphaParticles = true,
  particleColors = DEFAULT_COLORS,
  moveOnHover = false,
  hoverFactor = 1,
  disableRotation = false,
  className,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: Renderer | null = null;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let removeMouseListener: (() => void) | null = null;

    try {
      renderer = new Renderer({
        depth: false,
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    wrapper.appendChild(canvas);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const setSize = () => {
      const w = wrapper.clientWidth || window.innerWidth;
      const h = wrapper.clientHeight || window.innerHeight;
      renderer!.setSize(w, h);
      camera.perspective({ aspect: w / h });
    };
    setSize();

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => setSize());
      resizeObserver.observe(wrapper);
    } else {
      window.addEventListener("resize", setSize);
    }

    // 지오메트리 생성
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount * 4);
    const colors = new Float32Array(particleCount * 3);
    const palette = particleColors.length > 0 ? particleColors : DEFAULT_COLORS;

    // 큰 별(밝은 별) 비율: 약 5%
    const BRIGHT_STAR_RATIO = 0.05;
    const DISK_RADIUS = 1.0; // 정규화된 디스크 반경
    const DISK_THICKNESS = 0.15; // y축 두께 비율 (얇은 원반)

    for (let i = 0; i < particleCount; i++) {
      // 갤럭시 디스크 분포: 코어 밀집 + 얇은 원반 + 약한 나선 흔적
      const r = Math.pow(Math.random(), 2) * DISK_RADIUS; // 제곱으로 중심에 몰림
      const theta = Math.random() * Math.PI * 2;
      const armOffset = (Math.random() - 0.5) * 0.5; // 약한 나선 흔적
      const swirl = r * 0.5; // r에 비례한 회전 각도(나선 흐름)
      const x = Math.cos(theta + swirl) * r + armOffset * 0.1;
      const z = Math.sin(theta + swirl) * r + armOffset * 0.1;
      const y = (Math.random() - 0.5) * DISK_THICKNESS * DISK_RADIUS;
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // 5%는 큰 별 — random.x를 0.95+로 강제 (vertex shader가 자동으로 키움)
      const isBright = Math.random() < BRIGHT_STAR_RATIO;
      randoms[i * 4 + 0] = isBright ? 0.95 + Math.random() * 0.05 : Math.random();
      randoms[i * 4 + 1] = Math.random();
      randoms[i * 4 + 2] = Math.random();
      randoms[i * 4 + 3] = Math.random();

      const c = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors[i * 3 + 0] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    // 마우스 호버 (옵션)
    if (moveOnHover) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseRef.current.x = nx;
        mouseRef.current.y = ny;
      };
      window.addEventListener("mousemove", onMouseMove);
      removeMouseListener = () =>
        window.removeEventListener("mousemove", onMouseMove);
    }

    const start = performance.now();

    const renderOnce = (t: number) => {
      program.uniforms.uTime.value = t * speed * 0.001;

      if (!disableRotation) {
        // 은하수 분위기: 회전 속도 절반으로 톤다운
        mesh.rotation.x = Math.sin(t * 0.0001) * 0.05;
        mesh.rotation.y = Math.cos(t * 0.00015) * 0.08;
      }

      if (moveOnHover) {
        mesh.position.x += (mouseRef.current.x * hoverFactor - mesh.position.x) * 0.05;
        mesh.position.y += (mouseRef.current.y * hoverFactor - mesh.position.y) * 0.05;
      }

      renderer!.render({ scene: mesh, camera });
    };

    if (prefersReducedMotion) {
      // 정적 렌더 1회
      renderOnce(start);
    } else {
      const loop = (now: number) => {
        renderOnce(now - start);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", setSize);
      }
      if (removeMouseListener) removeMouseListener();
      try {
        const loseExt = gl.getExtension("WEBGL_lose_context");
        if (loseExt && typeof loseExt === "object" && "loseContext" in loseExt) {
          (loseExt as { loseContext: () => void }).loseContext();
        }
      } catch {
        // noop
      }
      if (canvas.parentNode === wrapper) {
        wrapper.removeChild(canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    alphaParticles,
    moveOnHover,
    hoverFactor,
    disableRotation,
    // particleColors는 배열 참조로 의도적으로 고정 — 부모에서 안정적인 참조 사용 권장
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  return <div ref={wrapperRef} className={className} />;
}
