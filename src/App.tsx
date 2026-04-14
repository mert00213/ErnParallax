import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════ */

interface StatItem {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}

interface BlueprintLayerProps {
  label: string;
  sublabel: string;
  tagline: string;
  color: string;
  colorRaw: string;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
  height: string;
  roundedTop?: boolean;
  roundedBottom?: boolean;
  children?: ReactNode;
  index: number;
}

/* ═══════════════════════════════════════════
   STAT CARD COMPONENT
   ═══════════════════════════════════════════ */

function StatCard({
  stat,
  index,
}: {
  stat: StatItem;
  index: number;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative bg-ground p-8 md:p-12 lg:p-16
                 hover:bg-white/[0.02] transition-all duration-700 cursor-default"
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                    from-transparent via-accent/0 to-transparent
                    group-hover:via-accent/40 transition-all duration-700"
      />

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/[0.04] group-hover:border-accent/15 transition-colors duration-700" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/[0.04] group-hover:border-accent/15 transition-colors duration-700" />

      {/* Index number & label */}
      <div className="flex items-center justify-between mb-12">
        <span className="font-mono text-[10px] md:text-[11px] text-white/20 tracking-[0.3em] uppercase">
          {stat.label}
        </span>
        <span className="text-accent/15 group-hover:text-accent/50 transition-colors duration-500 text-xs font-mono">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Value — devasa tipografi */}
      <div
        className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-[-0.05em] leading-[0.85]
                    ${stat.accent ? "text-accent text-glow" : "text-white/90"}
                    group-hover:text-white transition-colors duration-500`}
      >
        {stat.value}
      </div>

      {/* Unit */}
      <div className="mt-5 font-mono text-[10px] md:text-xs text-white/15 tracking-[0.25em] uppercase">
        {stat.unit}
      </div>

      {/* Bottom corner decoration */}
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-white/[0.04] group-hover:border-accent/15 transition-colors duration-700" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/[0.04] group-hover:border-accent/15 transition-colors duration-700" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   BLUEPRINT LAYER COMPONENT
   ═══════════════════════════════════════════ */

function BlueprintLayer({
  label,
  sublabel,
  tagline,
  color,
  colorRaw,
  y,
  opacity,
  scale,
  rotate,
  height,
  roundedTop,
  roundedBottom,
  children,
  index,
}: BlueprintLayerProps): JSX.Element {
  const borderRadius = `${roundedTop ? "28px" : "3px"} ${roundedTop ? "28px" : "3px"} ${roundedBottom ? "16px" : "3px"} ${roundedBottom ? "16px" : "3px"}`;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-4xl"
      style={{ y, opacity, scale, rotateX: rotate }}
    >
      <div
        className={`relative border border-dashed backdrop-blur-sm ${height} transition-shadow duration-700`}
        style={{
          borderColor: color,
          backgroundColor: `color-mix(in srgb, ${colorRaw} 4%, transparent)`,
          borderRadius,
          boxShadow: `inset 0 0 60px color-mix(in srgb, ${colorRaw} 3%, transparent), 0 0 40px color-mix(in srgb, ${colorRaw} 2%, transparent)`,
        }}
      >
        {/* Layer index badge — top-left corner */}
        <div
          className="absolute -top-3 left-6 md:left-8 px-3 py-0.5 font-mono text-[8px] md:text-[9px] tracking-[0.35em] uppercase z-10"
          style={{
            backgroundColor: "#011210",
            color,
            border: `1px solid ${color}`,
            borderRadius: "2px",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Left label arm — Desktop */}
        <div className="absolute -left-6 md:-left-36 lg:-left-44 top-1/2 -translate-y-1/2 text-right hidden md:block">
          <span
            className="font-mono text-[10px] lg:text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ color }}
          >
            {label}
          </span>
          <div
            className="w-14 lg:w-24 h-px ml-auto mt-1.5"
            style={{ backgroundColor: colorRaw, opacity: 0.35 }}
          />
          <span className="font-mono text-[8px] text-white/15 mt-1 block">
            {sublabel}
          </span>
        </div>

        {/* Mobile label — top-left */}
        <div className="absolute top-4 left-4 md:hidden z-10">
          <span
            className="font-mono text-[9px] tracking-[0.15em] uppercase font-semibold"
            style={{ color }}
          >
            {label}
          </span>
          <span className="block font-mono text-[7px] text-white/20 mt-0.5">
            {sublabel}
          </span>
        </div>

        {/* Inner structure frames — nested depth */}
        <div
          className="absolute inset-3 md:inset-5 lg:inset-6 border border-dotted"
          style={{
            borderColor: `color-mix(in srgb, ${colorRaw} 10%, transparent)`,
            borderRadius: `${roundedTop ? "20px" : "0"} ${roundedTop ? "20px" : "0"} ${roundedBottom ? "10px" : "0"} ${roundedBottom ? "10px" : "0"}`,
          }}
        />
        <div
          className="absolute inset-6 md:inset-9 lg:inset-10 border border-dotted hidden sm:block"
          style={{
            borderColor: `color-mix(in srgb, ${colorRaw} 5%, transparent)`,
            borderRadius: `${roundedTop ? "14px" : "0"} ${roundedTop ? "14px" : "0"} ${roundedBottom ? "6px" : "0"} ${roundedBottom ? "6px" : "0"}`,
          }}
        />
        <div
          className="absolute inset-9 md:inset-12 lg:inset-14 border border-dotted hidden lg:block"
          style={{
            borderColor: `color-mix(in srgb, ${colorRaw} 3%, transparent)`,
            borderRadius: `${roundedTop ? "8px" : "0"} ${roundedTop ? "8px" : "0"} ${roundedBottom ? "4px" : "0"} ${roundedBottom ? "4px" : "0"}`,
          }}
        />

        {/* Cross hairs — alignment marks */}
        <div
          className="absolute top-1/2 left-5 md:left-8 w-3 h-3 -translate-y-1/2"
          style={{
            borderTop: `1px solid color-mix(in srgb, ${colorRaw} 18%, transparent)`,
            borderLeft: `1px solid color-mix(in srgb, ${colorRaw} 18%, transparent)`,
          }}
        />
        <div
          className="absolute top-1/2 right-5 md:right-8 w-3 h-3 -translate-y-1/2"
          style={{
            borderTop: `1px solid color-mix(in srgb, ${colorRaw} 18%, transparent)`,
            borderRight: `1px solid color-mix(in srgb, ${colorRaw} 18%, transparent)`,
          }}
        />

        {/* Right dimension bracket — SVG */}
        <svg
          className="absolute -right-7 md:-right-14 lg:-right-18 top-0 h-full w-7 md:w-12 hidden sm:block"
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <line
            x1="20" y1="2" x2="20" y2="98"
            stroke="currentColor"
            className="text-white/[0.05]"
            strokeWidth="0.5"
            strokeDasharray="3 3"
          />
          <line
            x1="12" y1="2" x2="28" y2="2"
            stroke="currentColor"
            className="text-white/[0.07]"
            strokeWidth="0.5"
          />
          <line
            x1="12" y1="98" x2="28" y2="98"
            stroke="currentColor"
            className="text-white/[0.07]"
            strokeWidth="0.5"
          />
        </svg>

        {/* Tagline indicator — bottom right */}
        <div
          className="absolute bottom-2 right-4 font-mono text-[7px] md:text-[8px] tracking-wider opacity-25"
          style={{ color: colorRaw }}
        >
          {tagline}
        </div>

        {/* Layer-specific children */}
        {children}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   FLOATING PARTICLES — ambient decoration
   ═══════════════════════════════════════════ */

function FloatingParticles(): JSX.Element {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 10 + 6,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCAN LINE — blueprint aesthetic
   ═══════════════════════════════════════════ */

function ScanLine(): JSX.Element {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-20"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(204,255,0,0.12) 25%, rgba(204,255,0,0.25) 50%, rgba(204,255,0,0.12) 75%, transparent 100%)",
      }}
      animate={{ top: ["-5%", "105%"] }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 4,
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   HORIZONTAL RULE - section divider
   ═══════════════════════════════════════════ */

function SectionDivider(): JSX.Element {
  return (
    <div className="relative py-1">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(204,255,0,0.08) 20%, rgba(0,88,78,0.15) 50%, rgba(204,255,0,0.08) 80%, transparent)",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONNECTION LINE between layers
   ═══════════════════════════════════════════ */

function ConnectionLine(): JSX.Element {
  return (
    <div className="relative h-6 md:h-8">
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px"
        style={{
          transform: "translateX(-50%)",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(204,255,0,0.08), rgba(255,255,255,0.06))",
        }}
      />
      {/* Small diamond at center */}
      <div
        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45"
        style={{
          backgroundColor: "rgba(204,255,0,0.12)",
          border: "1px solid rgba(204,255,0,0.08)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APPLICATION
   ═══════════════════════════════════════════ */

export default function App(): JSX.Element {
  /* ─── Hero scroll tracking ─── */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroTextY: MotionValue<number> = useTransform(
    heroProgress,
    [0, 1],
    [0, -400]
  );
  const heroOpacity: MotionValue<number> = useTransform(
    heroProgress,
    [0, 0.35],
    [1, 0]
  );
  const heroScale: MotionValue<number> = useTransform(
    heroProgress,
    [0, 0.5],
    [1, 0.82]
  );
  const glowScale: MotionValue<number> = useTransform(
    heroProgress,
    [0, 1],
    [1, 3.5]
  );
  const glowOpacity: MotionValue<number> = useTransform(
    heroProgress,
    [0, 0.45],
    [0.65, 0]
  );
  const heroGridOpacity: MotionValue<number> = useTransform(
    heroProgress,
    [0, 0.6],
    [1, 0.15]
  );
  const heroOverlineY: MotionValue<number> = useTransform(
    heroProgress,
    [0, 1],
    [0, -180]
  );
  const heroSubtitleY: MotionValue<number> = useTransform(
    heroProgress,
    [0, 1],
    [0, -250]
  );

  /* ─── Exploded view scroll tracking ─── */
  const explodedRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: explodedProgress } = useScroll({
    target: explodedRef,
    offset: ["start end", "end start"],
  });

  // Three layers — separated with different parallax speeds
  const roofY: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 1],
    [400, 50, -100, -200, -320, -500]
  );
  const tribuneY: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [200, 40, 0, -20, -40, -100]
  );
  const groundY: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [120, 100, 120, 180, 280, 450]
  );

  // Layer scales — subtle breathing
  const roofScale: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.88, 0.96, 1, 0.98, 0.92]
  );
  const tribuneScale: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.92, 0.98, 1, 0.99, 0.95]
  );
  const groundScale: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.9, 0.97, 1, 0.98, 0.93]
  );

  // Layer opacities — fade in and out elegantly
  const roofOpacity: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.1, 0.15, 0.7, 0.9, 1],
    [0, 0, 1, 1, 0.4, 0]
  );
  const tribuneOpacity: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.12, 0.2, 0.65, 0.85, 1],
    [0, 0, 1, 1, 0.4, 0]
  );
  const groundOpacity: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.15, 0.25, 0.6, 0.8, 1],
    [0, 0, 1, 1, 0.4, 0]
  );

  // Layer rotations - subtle 3D perspective
  const roofRotate: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [8, 2, 0, -1, -4]
  );
  const tribuneRotate: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [4, 1, 0, -0.5, -2]
  );
  const groundRotate: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-6, -2, 0, 1, 3]
  );

  // Section label parallax
  const sectionNumY: MotionValue<number> = useTransform(
    explodedProgress,
    [0, 1],
    [-40, 40]
  );

  /* ─── Anatomy section ─── */
  const anatomyRef = useRef<HTMLDivElement>(null);
  const anatomyInView = useInView(anatomyRef, { once: true, margin: "-100px" });

  /* ─── Stats data — YENİ ANKARA 19 MAYIS STADYUMU ─── */
  const stats: StatItem[] = [
    { label: "Kapasite", value: "50.000", unit: "Seyirci", accent: true },
    { label: "Çatı Mimarisi", value: "17.000", unit: "Ton · Mega Çelik" },
    {
      label: "Aydınlatma",
      value: "UEFA",
      unit: "Elit LED Sistemi",
      accent: true,
    },
    { label: "Zemin", value: "Hibrit", unit: "Çim · Isıtmalı Sistem" },
  ];

  return (
    <div className="relative overflow-x-hidden bg-ground text-white">
      {/* ═══ Persistent noise overlay ═══ */}
      <div className="fixed inset-0 pointer-events-none z-50 noise" />

      {/* ═══ Persistent scan line ═══ */}
      <ScanLine />

      {/* ═══════════════════════════════════════════
          SECTION 01 — HERO
          ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[250vh]" id="hero">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Grid backgrounds with scroll-driven opacity */}
          <motion.div
            className="absolute inset-0 bg-grid"
            style={{ opacity: heroGridOpacity }}
          />
          <motion.div
            className="absolute inset-0 bg-grid-fine"
            style={{ opacity: heroGridOpacity }}
          />

          {/* Radial vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 20%, #011210 70%)",
            }}
          />

          {/* Floating particles */}
          <FloatingParticles />

          {/* Central glow orb — primary accent */}
          <motion.div
            className="absolute w-[500px] h-[500px] md:w-[900px] md:h-[900px] rounded-full"
            style={{
              scale: glowScale,
              opacity: glowOpacity,
              background:
                "radial-gradient(circle, rgba(204,255,0,0.12) 0%, rgba(0,88,78,0.08) 30%, transparent 60%)",
              filter: "blur(90px)",
            }}
          />

          {/* Secondary teal glow */}
          <motion.div
            className="absolute w-[350px] h-[350px] md:w-[700px] md:h-[700px] rounded-full"
            style={{
              opacity: glowOpacity,
              background:
                "radial-gradient(circle, rgba(0,88,78,0.25) 0%, transparent 50%)",
              filter: "blur(110px)",
              y: 120,
            }}
          />

          {/* Third accent halo — upper */}
          <motion.div
            className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full"
            style={{
              opacity: glowOpacity,
              background:
                "radial-gradient(circle, rgba(204,255,0,0.05) 0%, transparent 45%)",
              filter: "blur(60px)",
              y: -80,
              x: 100,
            }}
          />

          {/* Hero content */}
          <motion.div
            className="relative z-10 text-center px-6"
            style={{ y: heroTextY, opacity: heroOpacity, scale: heroScale }}
          >
            {/* Overline badge */}
            <motion.div
              className="inline-flex items-center gap-3 mb-8 md:mb-12"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ y: heroOverlineY }}
            >
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-accent/30" />
              <span className="font-mono text-[9px] md:text-xs text-accent/50 tracking-[0.5em] uppercase">
                Yeni Ankara Stadyumu
              </span>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-accent/30" />
            </motion.div>

            {/* Main title — devasa */}
            <motion.h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[13rem] font-black tracking-[-0.05em] leading-[0.82]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.4,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="block text-white">19 MAYIS</span>
              <span className="block text-accent text-glow mt-1 md:mt-4">
                STADYUMU
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-8 md:mt-16 text-white/20 text-sm md:text-lg lg:text-xl max-w-lg mx-auto font-light leading-relaxed tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              style={{ y: heroSubtitleY }}
            >
              Exploded View — Teknik Blueprint İncelemesi
            </motion.p>

            {/* Decorative gradient line */}
            <motion.div
              className="mt-8 mx-auto w-px h-16 md:h-24"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformOrigin: "top",
                background:
                  "linear-gradient(to bottom, rgba(204,255,0,0.4), rgba(0,88,78,0.1), transparent)",
              }}
            />

            {/* Scroll indicator */}
            <motion.div
              className="mt-10 md:mt-16 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <motion.span
                className="text-white/10 text-[9px] font-mono tracking-[0.5em] uppercase"
                animate={{ opacity: [0.15, 0.45, 0.15] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Keşfet
              </motion.span>
              <motion.div
                className="w-px h-14 bg-gradient-to-b from-accent/20 to-transparent"
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Corner decorations — thin technical lines */}
          <div className="absolute top-6 left-6 md:top-10 md:left-10 w-10 h-10 border-t border-l border-white/[0.05]" />
          <div className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 border-t border-r border-white/[0.05]" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 w-10 h-10 border-b border-l border-white/[0.05]" />
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-10 h-10 border-b border-r border-white/[0.05]" />

          {/* Side technical annotations */}
          <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 hidden lg:block">
            <div className="flex flex-col gap-16 items-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/[0.06]" />
                  <div className="w-6 h-px bg-white/[0.04]" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom edge gradient — smooth transition */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{
              background: "linear-gradient(to top, #011210, transparent)",
            }}
          />
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* ═══════════════════════════════════════════
          SECTION 02 — EXPLODED VIEW
          ═══════════════════════════════════════════ */}
      <section
        ref={explodedRef}
        className="relative min-h-[300vh] py-40"
        id="exploded-view"
        style={{ perspective: "1200px" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center">
          {/* Faint grid */}
          <div className="absolute inset-0 bg-grid-fine opacity-30" />

          {/* Ambient glow behind layers */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,88,78,0.35) 0%, transparent 65%)",
              filter: "blur(90px)",
            }}
          />

          {/* Secondary ambient glow */}
          <div
            className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(ellipse, rgba(204,255,0,0.08) 0%, transparent 60%)",
              filter: "blur(70px)",
            }}
          />

          <div className="relative w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
            {/* Section label */}
            <motion.div
              className="absolute -top-14 md:-top-18 left-6 md:left-12 lg:left-16"
              style={{ y: sectionNumY }}
            >
              <span className="font-mono text-[10px] md:text-xs text-accent/30 tracking-[0.4em] uppercase">
                02 — Exploded Blueprint
              </span>
            </motion.div>

            {/* ─── LAYER 01: MEGA ÇELİK ÇATI ─── */}
            <BlueprintLayer
              label="MEGA ÇELİK ÇATI"
              sublabel="17.000 Ton"
              tagline="MEMBRAN ÖRTÜ / ÇELİK KAFES"
              color="rgba(204,255,0,0.35)"
              colorRaw="#ccff00"
              y={roofY}
              opacity={roofOpacity}
              scale={roofScale}
              rotate={roofRotate}
              height="h-24 sm:h-28 md:h-36 lg:h-44"
              roundedTop
              index={0}
            >
              {/* Structural ribs */}
              <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-accent/[0.07] -translate-y-1/2" />
              <div className="absolute top-[20%] left-[15%] right-[15%] h-px bg-accent/[0.04]" />
              <div className="absolute top-[80%] left-[15%] right-[15%] h-px bg-accent/[0.04]" />
              {/* Diagonal structural lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <line
                  x1="15%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="rgba(204,255,0,0.04)"
                  strokeWidth="0.5"
                />
                <line
                  x1="85%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="rgba(204,255,0,0.04)"
                  strokeWidth="0.5"
                />
                <line
                  x1="30%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="rgba(204,255,0,0.025)"
                  strokeWidth="0.5"
                />
                <line
                  x1="70%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="rgba(204,255,0,0.025)"
                  strokeWidth="0.5"
                />
                {/* Horizontal ribs */}
                <line
                  x1="20%"
                  y1="40%"
                  x2="80%"
                  y2="40%"
                  stroke="rgba(204,255,0,0.02)"
                  strokeWidth="0.5"
                  strokeDasharray="4 6"
                />
                <line
                  x1="20%"
                  y1="60%"
                  x2="80%"
                  y2="60%"
                  stroke="rgba(204,255,0,0.02)"
                  strokeWidth="0.5"
                  strokeDasharray="4 6"
                />
              </svg>
              {/* Center anchor point */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full border border-accent/15" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent/30" />
              {/* Weight indicator */}
              <div className="absolute top-2 right-4 font-mono text-[7px] md:text-[8px] text-accent/15 tracking-wider">
                17.000 T
              </div>
            </BlueprintLayer>

            {/* Connection line */}
            <ConnectionLine />

            {/* ─── LAYER 02: AKUSTİK TRİBÜN ─── */}
            <BlueprintLayer
              label="AKUSTİK TRİBÜN"
              sublabel="50.000 Koltuk"
              tagline="VIP · LOCA · BASIN TRİBÜNÜ"
              color="rgba(0,122,108,0.5)"
              colorRaw="#007a6c"
              y={tribuneY}
              opacity={tribuneOpacity}
              scale={tribuneScale}
              rotate={tribuneRotate}
              height="h-36 sm:h-44 md:h-56 lg:h-64"
              index={1}
            >
              {/* Seat row lines */}
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={`row-${i}`}
                  className="absolute left-6 right-6 md:left-10 md:right-10 h-px"
                  style={{
                    top: `${8 + i * 8}%`,
                    background: `linear-gradient(90deg, transparent, rgba(0,122,108,0.08), transparent)`,
                  }}
                />
              ))}
              {/* Tiered section dividers — vertical */}
              <div className="absolute top-4 bottom-4 left-[20%] w-px bg-white/[0.04]" />
              <div className="absolute top-4 bottom-4 left-[40%] w-px bg-white/[0.03]" />
              <div className="absolute top-4 bottom-4 left-1/2 w-px bg-white/[0.05]" />
              <div className="absolute top-4 bottom-4 left-[60%] w-px bg-white/[0.03]" />
              <div className="absolute top-4 bottom-4 left-[80%] w-px bg-white/[0.04]" />
              {/* Central VIP zone highlight */}
              <div
                className="absolute top-[12%] bottom-[12%] left-[32%] right-[32%] border border-dotted rounded-sm"
                style={{ borderColor: "rgba(0,122,108,0.12)" }}
              />
              {/* VIP inner zone */}
              <div
                className="absolute top-[22%] bottom-[22%] left-[38%] right-[38%] border border-dotted rounded-sm hidden md:block"
                style={{ borderColor: "rgba(0,122,108,0.06)" }}
              />
              {/* Capacity badge */}
              <div className="absolute top-2 right-4 font-mono text-[7px] md:text-[8px] text-primary-light/25 tracking-wider">
                VIP · LOCA
              </div>
              {/* Seat count indicator */}
              <div className="absolute bottom-2 left-4 font-mono text-[7px] text-white/[0.08] tracking-wider hidden md:block">
                50.000 KOLTUK
              </div>
            </BlueprintLayer>

            {/* Connection line */}
            <ConnectionLine />

            {/* ─── LAYER 03: TEKNOLOJİK HİBRİT ZEMİN ─── */}
            <BlueprintLayer
              label="TEKNOLOJİK HİBRİT ZEMİN"
              sublabel="Isıtmalı Sistem"
              tagline="HİBRİT ÇİM · DRENAJ · ISITMA"
              color="rgba(34,197,94,0.3)"
              colorRaw="#22c55e"
              y={groundY}
              opacity={groundOpacity}
              scale={groundScale}
              rotate={groundRotate}
              height="h-28 sm:h-32 md:h-40 lg:h-48"
              roundedBottom
              index={2}
            >
              {/* Pitch outline */}
              <div className="absolute inset-5 md:inset-8 lg:inset-10 border border-white/[0.05] rounded-sm" />
              {/* Center line */}
              <div className="absolute top-5 bottom-5 md:top-8 md:bottom-8 left-1/2 w-px bg-white/[0.06]" />
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-24 md:h-24 rounded-full border border-white/[0.05]" />
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-500/25" />
              {/* Penalty areas */}
              <div className="absolute top-[16%] bottom-[16%] left-5 md:left-8 w-[14%] border border-white/[0.04] rounded-sm" />
              <div className="absolute top-[16%] bottom-[16%] right-5 md:right-8 w-[14%] border border-white/[0.04] rounded-sm" />
              {/* Goal areas */}
              <div className="absolute top-[28%] bottom-[28%] left-5 md:left-8 w-[7%] border border-white/[0.03] rounded-sm" />
              <div className="absolute top-[28%] bottom-[28%] right-5 md:right-8 w-[7%] border border-white/[0.03] rounded-sm" />
              {/* Heating grid pattern */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={`heat-${i}`}
                  className="absolute left-[18%] right-[18%] h-px"
                  style={{
                    top: `${18 + i * 10}%`,
                    background:
                      "linear-gradient(90deg, transparent, rgba(34,197,94,0.05), transparent)",
                  }}
                />
              ))}
              {/* Corner arc - bottom left */}
              <svg
                className="absolute bottom-5 left-5 md:bottom-8 md:left-8 w-6 h-6 md:w-10 md:h-10"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M0 40 A40 40 0 0 1 40 0"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                  fill="none"
                />
              </svg>
              {/* Corner arc - bottom right */}
              <svg
                className="absolute bottom-5 right-5 md:bottom-8 md:right-8 w-6 h-6 md:w-10 md:h-10"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M40 40 A40 40 0 0 0 0 0"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                  fill="none"
                />
              </svg>
              {/* Dimensions */}
              <div className="absolute top-2 right-4 font-mono text-[7px] md:text-[8px] text-white/10 tracking-wider">
                105m × 68m
              </div>
            </BlueprintLayer>
          </div>
        </div>
      </section>

      {/* Divider */}
      <SectionDivider />

      {/* ═══════════════════════════════════════════
          SECTION 03 — ANATOMY (TECHNICAL SPECS)
          ═══════════════════════════════════════════ */}
      <section
        ref={anatomyRef}
        className="relative min-h-screen py-36 md:py-56 lg:py-72"
        id="anatomy"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-15" />

        {/* Top gradient transition */}
        <div
          className="absolute top-0 left-0 right-0 h-48"
          style={{
            background: "linear-gradient(to bottom, #011210, transparent)",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, rgba(204,255,0,0.15) 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Section header */}
          <motion.div
            className="mb-24 md:mb-40 lg:mb-52"
            initial={{ opacity: 0, y: 120 }}
            animate={anatomyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[10px] md:text-xs text-accent/30 tracking-[0.4em] uppercase block mb-8 md:mb-12">
              03 — Anatomy
            </span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[11rem] font-black tracking-[-0.05em] leading-[0.85]">
              <span className="block text-white/90">Teknik</span>
              <span className="block text-accent text-glow mt-2 md:mt-4">
                Anatomisi
              </span>
            </h2>

            {/* Subtitle */}
            <motion.p
              className="mt-8 md:mt-14 text-white/18 text-sm md:text-base lg:text-lg max-w-xl font-light leading-relaxed tracking-wide"
              initial={{ opacity: 0 }}
              animate={anatomyInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Yeni Ankara 19 Mayıs Stadyumu'nun devasa ölçekli teknik
              özellikleri — yapısal mühendislik detayları.
            </motion.p>

            {/* Decorative line */}
            <motion.div
              className="mt-10 md:mt-16 w-24 md:w-40 h-px"
              initial={{ scaleX: 0 }}
              animate={anatomyInView ? { scaleX: 1 } : {}}
              transition={{
                duration: 1.2,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformOrigin: "left",
                background:
                  "linear-gradient(to right, rgba(204,255,0,0.5), rgba(0,88,78,0.2), transparent)",
              }}
            />
          </motion.div>

          {/* Stats grid — 2x2 layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.03] rounded-sm overflow-hidden">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>

          {/* Bottom credits */}
          <motion.div
            className="mt-20 md:mt-32 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={anatomyInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="w-12 h-px bg-white/[0.05]" />
            <span className="font-mono text-[8px] md:text-[9px] text-white/10 tracking-[0.4em] uppercase">
              Aktif İnşaat · Ankara
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="relative h-[35vh] flex items-center justify-center border-t border-white/[0.03]">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-grid-fine opacity-15" />

        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-20"
          style={{
            background: "linear-gradient(to bottom, #011210, transparent)",
          }}
        />

        <div className="relative text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/15" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
          <p className="font-mono text-[9px] md:text-[10px] text-white/8 tracking-[0.5em] uppercase">
            ErnParallax — 19 Mayıs Stadyumu Blueprint
          </p>
          <p className="mt-3 font-mono text-[8px] text-white/5 tracking-[0.3em] uppercase">
            Yeni Ankara · 50.000 Kapasite · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
