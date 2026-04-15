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

interface PhaseMedia {
  type: "image" | "video";
  src: string;
  alt?: string; // Sadece resimler için gerekli
  zIndex: number;
  opacity: { input: number[]; output: number[] };
  scale: { input: number[]; output: number[] };
  rotate?: { input: number[]; output: number[] };
  y?: { input: number[]; output: number[] };
  transformOrigin?: string;
}

interface InfoCard {
  title: string;
  description: string;
  position: "bottom-left" | "top-right" | "top-left" | "bottom-center";
  enterRange: [number, number];
  exitRange: [number, number];
  className?: string;
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION DATA & MODERN CONFIG
   ═══════════════════════════════════════════════════════════════ */

const PHASE_MEDIA: PhaseMedia[] = [
  {
    // Phase 1 — Gündüz Renderı (VİDEO)
    type: "video",
    src: "/stadvideo1.mp4",
    zIndex: 20,
    opacity: { input: [0, 0.20, 0.35], output: [1, 1, 0] },
    // Hafifçe büyür (1 -> 1.05) ve dönerek estetik bir his verir
    scale:   { input: [0, 0.25],        output: [1, 1.05] },
    rotate:  { input: [0, 0.25],        output: [0, 1.5] },
  },
  {
    // Phase 2 — Gece Renderı (VİDEO - Dinamik Cross-fade)
    type: "video",
    src: "/stadvideo2.mp4",
    zIndex: 30,
    opacity: { input: [0.18, 0.30, 0.45, 0.58], output: [0, 1, 1, 0] },
    // Gece renderı gelirken de ufak bir büyüme devam eder (kusursuz akış)
    scale:   { input: [0.25, 0.50],               output: [1.02, 1.08] },
  },
  {
    // Phase 3 — Mimari Kesit (RESİM - Subtle zoom and float)
    type: "image",
    src: "/image7.jpg",
    alt: "Mimari Kesit — 19 Mayıs Stadyumu",
    zIndex: 40,
    opacity: { input: [0.45, 0.56, 0.70, 0.86], output: [0, 1, 1, 0] },
    // Sonlara doğru (Phase 4'e geçerken) scale 1.5'a çıkarak ekrandan taşar
    scale:   { input: [0.50, 0.70, 0.90],        output: [1, 1.05, 1.5] },
    y:       { input: [0.50, 0.70, 0.90],        output: [20, 0, -50] }, // Float effect
    transformOrigin: "center center",
  },
  {
    // Phase 4 — İç Saha / Final (RESİM - Dramatik Dive-in)
    type: "image",
    src: "/image3.jpg",
    alt: "İç Saha — 19 Mayıs Stadyumu",
    zIndex: 10, // zIndex en düşük, çünkü Phase 3 şeffaflaşırken altından çıkacak
    opacity: { input: [0.70, 0.86], output: [0, 1] },
    // Dramatik scale: 1 -> 1.25
    scale:   { input: [0.75, 1.0],  output: [1, 1.25] },
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
    className: "md:w-[500px] text-center", // Daha geniş ve ortalanmış metin
  },
];

/** Maps card position keys to Tailwind positioning classes */
const POSITION_CLASSES: Record<InfoCard["position"], string> = {
  "bottom-left":   "bottom-12 left-6 md:bottom-20 md:left-16",
  "top-right":     "top-12 right-6 md:top-20 md:right-16",
  "top-left":      "top-12 left-6 md:top-20 md:left-16",
  "bottom-center": "bottom-12 left-1/2 -translate-x-1/2 md:bottom-20",
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function ParallaxMedia({
  media,
  scrollYProgress,
}: {
  media: PhaseMedia;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    media.opacity.input,
    media.opacity.output,
  );
  const scale = useTransform(
    scrollYProgress,
    media.scale.input,
    media.scale.output,
  );
  
  const defaultRotation = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const rotate = media.rotate 
    ? useTransform(scrollYProgress, media.rotate.input, media.rotate.output) 
    : defaultRotation;

  const defaultY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const y = media.y
    ? useTransform(scrollYProgress, media.y.input, media.y.output)
    : defaultY;

  return (
    <motion.div
      className="absolute inset-0 will-change-[opacity]"
      style={{ zIndex: media.zIndex, opacity }}
    >
      {media.type === "video" ? (
        <motion.video
          src={media.src}
          className="h-full w-full object-cover will-change-transform"
          style={{ 
            scale, 
            rotate, 
            y,
            transformOrigin: media.transformOrigin || "center" 
          }}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <motion.img
          src={media.src}
          alt={media.alt}
          className="h-full w-full object-cover will-change-transform"
          style={{ 
            scale, 
            rotate, 
            y,
            transformOrigin: media.transformOrigin || "center" 
          }}
          loading="eager"
          decoding="async"
        />
      )}
    </motion.div>
  );
}

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

  // Daha pürüzsüz giriş-çıkış hissi için Y ekseninde 60px hareket
  const opacity = useTransform(
    scrollYProgress,
    [enterRange[0], enterRange[1], exitRange[0], exitRange[1]],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    scrollYProgress,
    [enterRange[0], enterRange[1], exitRange[0], exitRange[1]],
    [60, 0, 0, -60], 
  );

  return (
    <motion.div
      className={`absolute z-50 w-[85vw] max-w-sm md:max-w-md ${POSITION_CLASSES[card.position]} ${card.className || ''}`}
      style={{ opacity, y }}
    >
      {/* 
        Modern, Lüks ve Asil Kart Tasarımı (Glow Detayları Eklenmiş)
        border ve shadow detayları #00584E rengine hafif uyumlu hale getirildi
      */}
      <div className="bg-black/30 backdrop-blur-md border border-[#00584E]/30 rounded-3xl p-8 md:p-10 shadow-[0_12px_48px_0_rgba(0,88,78,0.25)] relative overflow-hidden group">
        
        {/* İnce #00584E Vurgusu (Üst çizgi) */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00584E] to-transparent opacity-80" />
        
        {/* Hafif içeriden parlayan #00584E köşe gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00584E]/10 to-transparent pointer-events-none" />

        <span className={`block text-xs font-mono uppercase tracking-[0.35em] text-[#00584E] mb-4 
            ${card.position === "bottom-center" ? "mx-auto" : ""}`}>
          Phase {String(index + 1).padStart(2, "0")}
        </span>

        {/* Başlık: İnce, zarif, büyük harfli, geniş aralıklı */}
        <h3 className="text-2xl md:text-3xl font-extralight uppercase tracking-widest text-white/90 mb-4 leading-tight">
          {card.title}
        </h3>

        {/* İçerik Metni: Temiz, okunaklı, gri */}
        <p className="text-base md:text-lg font-light text-gray-200 leading-relaxed">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}

function ScrollIndicator({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <motion.div
      className="absolute bottom-10 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-3"
      style={{ opacity }}
    >
      <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#00584E]">
        Scroll
      </span>
      <motion.div 
        className="w-[1px] h-12 bg-gradient-to-b from-[#00584E] to-transparent origin-top"
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0], y: [0, 10, 20] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
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

  // İlerleme çubuğu X ekseni scale
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] bg-[#020504]" // Koyu antrasit/kara arkaplan
      aria-label="19 Mayıs Stadyumu — Mimari Sunum"
    >
      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        
        {/* Görsel/Video Katmanları */}
        {PHASE_MEDIA.map((media, i) => (
          <ParallaxMedia
            key={media.src}
            media={media}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Sinematik Vignette (Köşeleri Karartma) - Ortası %30'a kadar şeffaf, köşeler dramatik siyah */}
        <div
          className="pointer-events-none absolute inset-0 z-[45]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Bilgi Kartları */}
        {INFO_CARDS.map((card, i) => (
          <GlassCard
            key={card.title}
            card={card}
            scrollYProgress={scrollYProgress}
            index={i}
          />
        ))}

        {/* Scroll Endikatörü */}
        <ScrollIndicator scrollYProgress={scrollYProgress} />

        {/* ── Progress Bar (#00584E Asil Rengi) ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[60] h-1.5 origin-left bg-[#00584E]"
          style={{ scaleX: progressScaleX }}
        />
      </div>
    </section>
  );
}
