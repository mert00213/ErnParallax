import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

/** Scroll-driven image layer configuration */
interface PhaseImage {
  src: string;
  alt: string;
  zIndex: number;
  opacity: { input: number[]; output: number[] };
  scale: { input: number[]; output: number[] };
}

/** Glassmorphism info card configuration */
interface InfoCard {
  title: string;
  description: string;
  position: "bottom-left" | "top-right" | "top-left" | "bottom-center";
  enterRange: [number, number];
  exitRange: [number, number];
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION DATA — Scroll-percentage-based keyframes
   ═══════════════════════════════════════════════════════════════
   Phase 1 :  0%  – 25%   image5  (Gündüz Renderı)
   Phase 2 : 25%  – 50%   image6  (Gece Renderı)
   Phase 3 : 50%  – 75%   image7  (Mimari Kesit)
   Phase 4 : 75%  – 100%  image3  (İç Saha / Final)

   Z-index stacking (higher = renders on top):
     z-10  image3  — bottom layer, revealed when image7 zooms away
     z-20  image5  — base layer, always visible at start
     z-30  image6  — fades in over image5
     z-40  image7  — fades in over image6, then scales up to reveal image3
   ═══════════════════════════════════════════════════════════════ */

const PHASE_IMAGES: PhaseImage[] = [
  {
    // Phase 1 — Gündüz Renderı
    src: "/image5.jpg",
    alt: "Gündüz Renderı — 19 Mayıs Stadyumu",
    zIndex: 20,
    opacity: { input: [0, 0.20, 0.35], output: [1, 1, 0] },
    scale:   { input: [0, 0.25],        output: [1, 1.1] },
  },
  {
    // Phase 2 — Gece Renderı (cross-fade with Phase 1)
    src: "/image6.jpg",
    alt: "Gece Renderı — 19 Mayıs Stadyumu",
    zIndex: 30,
    opacity: { input: [0.18, 0.30, 0.45, 0.58], output: [0, 1, 1, 0] },
    scale:   { input: [0.25, 0.50],               output: [1, 1.05] },
  },
  {
    // Phase 3 — Mimari Kesit
    src: "/image7.jpg",
    alt: "Mimari Kesit — 19 Mayıs Stadyumu",
    zIndex: 40,
    opacity: { input: [0.45, 0.56, 0.70, 0.86], output: [0, 1, 1, 0] },
    scale:   { input: [0.50, 0.70, 0.90],        output: [1, 1, 1.5] },
  },
  {
    // Phase 4 — İç Saha (revealed beneath image7's zoom)
    src: "/image3.jpg",
    alt: "İç Saha — 19 Mayıs Stadyumu",
    zIndex: 10,
    opacity: { input: [0.70, 0.86], output: [0, 1] },
    scale:   { input: [0.86, 1.0],  output: [1, 1.05] },
  },
];

const INFO_CARDS: InfoCard[] = [
  {
    title: "Geleceğin Başkenti",
    description: "Modern mimarisiyle şehrin yeni simgesi.",
    position: "bottom-left",
    enterRange: [0.0, 0.04],
    exitRange:  [0.18, 0.23],
  },
  {
    title: "Gece Silüeti",
    description: "Entegre LED sistemleriyle ışıldayan parametrik kabuk.",
    position: "top-right",
    enterRange: [0.28, 0.35],
    exitRange:  [0.43, 0.48],
  },
  {
    title: "Mühendislik Harikası",
    description: "Optimize edilmiş çatı ve rüzgar analizi.",
    position: "top-left",
    enterRange: [0.53, 0.60],
    exitRange:  [0.68, 0.73],
  },
  {
    title: "45.000 Kapasiteli Atmosfer",
    description: "Türkiye'nin en canlı tribün deneyimi.",
    position: "bottom-center",
    enterRange: [0.78, 0.85],
    exitRange:  [0.93, 0.98],
  },
];

/** Maps card position keys to Tailwind positioning classes */
const POSITION_CLASSES: Record<InfoCard["position"], string> = {
  "bottom-left":   "bottom-12 left-6 md:bottom-20 md:left-12",
  "top-right":     "top-12 right-6 md:top-20 md:right-12",
  "top-left":      "top-12 left-6 md:top-20 md:left-12",
  "bottom-center": "bottom-12 left-1/2 -translate-x-1/2 md:bottom-20",
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Single scroll-driven image layer.
 * Opacity and scale are both mapped to scrollYProgress.
 */
function ParallaxImage({
  image,
  scrollYProgress,
}: {
  image: PhaseImage;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    image.opacity.input,
    image.opacity.output,
  );
  const scale = useTransform(
    scrollYProgress,
    image.scale.input,
    image.scale.output,
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-[opacity]"
      style={{ zIndex: image.zIndex, opacity }}
    >
      <motion.img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover will-change-transform"
        style={{ scale }}
        loading="eager"
        decoding="async"
      />
    </motion.div>
  );
}

/**
 * Glassmorphism info card that slides in/out on the Y axis.
 * Each card is positioned according to its phase configuration.
 */
function GlassCard({
  card,
  scrollYProgress,
  index,
}: {
  card: InfoCard;
  scrollYProgress: MotionValue<number>;
  index: number;
}) {
  const { enterRange, exitRange } = card;

  const opacity = useTransform(
    scrollYProgress,
    [enterRange[0], enterRange[1], exitRange[0], exitRange[1]],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    scrollYProgress,
    [enterRange[0], enterRange[1], exitRange[0], exitRange[1]],
    [50, 0, 0, -50],
  );

  return (
    <motion.div
      className={`absolute z-50 w-[85vw] max-w-md ${POSITION_CLASSES[card.position]}`}
      style={{ opacity, y }}
    >
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
        {/* Subtle red accent line at the top of the card */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        {/* Phase number indicator */}
        <span className="block text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-4">
          Phase {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="text-2xl md:text-3xl font-extralight uppercase tracking-widest text-white mb-3 leading-tight">
          {card.title}
        </h3>

        <p className="text-sm md:text-base font-light text-white/60 leading-relaxed">
          {card.description}
        </p>

        {/* Bottom decorative line */}
        <div className="mt-6 h-px w-12 bg-gradient-to-r from-red-500/50 to-transparent" />
      </div>
    </motion.div>
  );
}

/**
 * Animated scroll-down indicator visible only at the very start.
 */
function ScrollIndicator({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-2"
      style={{ opacity }}
    >
      <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/40">
        Scroll
      </span>
      <motion.svg
        width="16"
        height="24"
        viewBox="0 0 16 24"
        fill="none"
        className="text-white/40"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M8 0v20m0 0l-6-6m6 6l6-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT — ErnParallax
   ═══════════════════════════════════════════════════════════════ */

export default function ErnParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Progress bar scale
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh]"
      aria-label="19 Mayıs Stadyumu — Mimari Sunum"
    >
      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Image layers */}
        {PHASE_IMAGES.map((image, i) => (
          <ParallaxImage
            key={image.src}
            image={image}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Cinematic vignette overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[45]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Top & bottom gradient bars for extra depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[46] h-32 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[46] h-32 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Info cards */}
        {INFO_CARDS.map((card, i) => (
          <GlassCard
            key={card.title}
            card={card}
            scrollYProgress={scrollYProgress}
            index={i}
          />
        ))}

        {/* Scroll indicator (Phase 1 only) */}
        <ScrollIndicator scrollYProgress={scrollYProgress} />

        {/* ── Progress Bar ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[60] h-[3px] origin-left bg-red-600"
          style={{ scaleX: progressScaleX }}
        />
      </div>
    </section>
  );
}
