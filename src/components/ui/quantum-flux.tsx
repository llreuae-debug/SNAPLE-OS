import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowRight, Shield, Activity, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export interface QuantumFluxProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  density?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  showContent?: boolean;
  onActionClick?: (action: string) => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  height?: string;
}

export const QuantumFlux: React.FC<QuantumFluxProps> = ({
  title = 'SNAPLE-OS',
  subtitle = 'INTELLIGENT GROUP OPERATING SYSTEM',
  description = 'Unified governance, measurable daily output, commercial pipeline & AI orchestration across DAGMAR, Pixel Park & Novelty.',
  className,
  density = 'medium',
  interactive = true,
  showContent = true,
  onActionClick,
  primaryActionLabel = 'Open Dashboard',
  secondaryActionLabel = 'Explore AI',
  height = 'min-h-[380px]'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isHovered: boolean }>({
    x: -1000,
    y: -1000,
    isHovered: false
  });

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Responsive & prefers-reduced-motion check
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const initNodes = useCallback(
    (width: number, height: number): Node[] => {
      const isMobile = width < 768;
      let count = density === 'low' ? 24 : density === 'high' ? 65 : 42;
      if (isMobile) count = Math.floor(count * 0.55);

      const palette = isDark
        ? ['#8FAEA4', '#B3A9D0', '#91A8B0', '#7FA88E', '#A9C9D8']
        : ['#7D9B91', '#A9A0C4', '#8299A2', '#6A877E', '#BDCBD1'];

      const nodes: Node[] = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2.2 + 1.2;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius,
          baseRadius: radius,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.5 + 0.35,
          pulseSpeed: Math.random() * 0.025 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
      return nodes;
    },
    [density, isDark]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let nodes = initNodes(width, height);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0 && (newWidth !== width || newHeight !== height)) {
          width = newWidth;
          height = newHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
          nodes = initNodes(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    // Pointer listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isHovered: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, isHovered: false };
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    const maxConnectionDistance = width < 768 ? 90 : 130;
    const mouseRadius = 140;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background radial gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.4
      );

      if (isDark) {
        gradient.addColorStop(0, 'rgba(143, 174, 164, 0.08)');
        gradient.addColorStop(0.5, 'rgba(179, 169, 208, 0.04)');
        gradient.addColorStop(1, 'rgba(23, 28, 27, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(125, 155, 145, 0.12)');
        gradient.addColorStop(0.5, 'rgba(169, 160, 196, 0.06)');
        gradient.addColorStop(1, 'rgba(238, 240, 236, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Connective Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const lineAlpha = (1 - dist / maxConnectionDistance) * (isDark ? 0.28 : 0.22);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(179, 169, 208, ${lineAlpha})`
              : `rgba(125, 155, 145, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          node.pulsePhase += node.pulseSpeed;
          node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.6;

          // Velocity movement
          node.x += node.vx;
          node.y += node.vy;

          // Boundary bouncing
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Mouse gravity interaction
          if (interactive && mouseRef.current.isHovered) {
            const mdx = mouseRef.current.x - node.x;
            const mdy = mouseRef.current.y - node.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < mouseRadius) {
              const force = (1 - mdist / mouseRadius) * 0.6;
              node.x -= (mdx / mdist) * force * 1.5;
              node.y -= (mdy / mdist) * force * 1.5;

              // Draw mouse tether line
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
              ctx.strokeStyle = isDark
                ? `rgba(143, 174, 164, ${0.4 * (1 - mdist / mouseRadius)})`
                : `rgba(169, 160, 196, ${0.35 * (1 - mdist / mouseRadius)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // Draw node circle with soft outer glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.5, node.radius), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [initNodes, interactive, isDark, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-[var(--border-base)] ui-surface-elevated flex items-center justify-center p-6 sm:p-10 shadow-lg',
        height,
        className
      )}
    >
      {/* Interactive Canvas Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />

      {/* Floating Foreground Content Card */}
      {showContent && (
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4 pointer-events-none">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-elevated)]/90 backdrop-blur-md border border-[var(--border-base)] shadow-sm pointer-events-auto select-none">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-secondary)] uppercase">
              {subtitle}
            </span>
          </div>

          {/* Main Title with Soft 3D Glow */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] select-none">
            {title}
          </h1>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto font-normal">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <button
              onClick={() => onActionClick?.('dashboard')}
              className="btn-tactile-primary px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>{primaryActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onActionClick?.('ai')}
              className="btn-tactile-secondary px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[var(--brand-accent)]" />
              <span>{secondaryActionLabel}</span>
            </button>
          </div>

          {/* Micro Status Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-[var(--text-muted)] select-none">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#7FA88E]" /> RBAC/ABAC Scoped
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[var(--brand-primary)]" /> 99.9% Uptime Sentinel
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[var(--brand-accent)]" /> Quantum Mesh Core
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
