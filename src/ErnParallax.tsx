import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   VERİ YAPILANDIRMASI
   ═══════════════════════════════════════════════════════════════ */

const SECTIONS = [
  {
    id: "01",
    media: "/stadvideo1.mp4",
    type: "video",
    year: "2026",
    highlightStat: "120.000m²",
    highlightLabel: "TOPLAM ALAN",
    titleBold: "Ankara",
    titleLight: "19Mayıs",
    description: "Şehrin kalbinde yeni nesil bir atmosfer ve ekstrem performans odaklı mimari.",
    buttonText: "KEŞFET",
    layout: "hero",
    range: [0, 0.20, 0.30],
  },
  {
    id: "02",
    media: "/stadvideo2.mp4",
    type: "video",
    titleBold: "Mimari",
    titleLight: "Tasarım",
    description: "Parametrik kabuk ve entegre LED sistemleriyle yeni nesil stadyum silüeti.",
    buttonText: "İNCELE",
    layout: "left-focus",
    range: [0.20, 0.45, 0.55],
  },
  {
    id: "03",
    media: "/image7.jpg",
    type: "image",
    titleBold: "Statik",
    titleLight: "Analiz",
    description: "Kusursuz rüzgar analizi ve yenilikçi çelik strüktür ile statik mükemmellik.",
    buttonText: "DETAYLAR",
    layout: "specs-right",
    range: [0.45, 0.70, 0.80],
    specs: [
      { title: "KABUK", desc: "ETFE Membran" },
      { title: "RÜZGAR DİRENCİ", desc: "Aero-Optimize" },
      { title: "ÇATI", desc: "Açılır Kapanır" },
      { title: "IŞIK", desc: "RGBW Matrix" }
    ]
  },
  {
    id: "04",
    media: "/hero_video.mp4",
    type: "video",
    titleBold: "İç Saha",
    titleLight: "Deneyimi",
    description: "Devasa akustik derinlik ve kesintisiz görüş alanıyla sahaya hükmeden odak tasarımı.",
    buttonText: "HİSSET",
    layout: "left-focus",
    range: [0.70, 0.90, 1.0],
    highlightStat: "45,000",
    highlightLabel: "KAPASİTE",
  },
];

/* ═══════════════════════════════════════════════════════════════
   BİLEŞENLER
   ═══════════════════════════════════════════════════════════════ */

const FixedUI = () => (
  <>
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-12 md:py-8 pointer-events-none">
      <div className="flex items-center gap-5">
        <img
          src="/ern_holding.png"
          alt="Ern Holding"
          className="h-7 md:h-8 w-auto object-contain drop-shadow-md opacity-90"
        />
        <div className="hidden md:block h-4 w-[1px] bg-white/20" />
        <span className="hidden md:block text-white/40 font-light text-[8px] tracking-[0.4em] uppercase mt-0.5">
          19 Mayıs Projesi
        </span>
      </div>

      <div className="flex items-center gap-8 pointer-events-auto">
        <span className="text-white/60 text-[10px] tracking-widest font-medium cursor-pointer hover:text-white transition-colors">TR</span>
        <button className="border border-white/10 text-white/80 px-5 py-2 rounded-full text-[10px] tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all duration-500">
          İLETİŞİM
        </button>
      </div>
    </header>

    {/* SAĞ SOSYAL MEDYA BARI - TWITTER (X) EKLENDİ */}
    <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-10 hidden md:flex pointer-events-none">
      <div className="flex flex-col gap-6 scale-90 pointer-events-auto">
        {/* Facebook */}
        <a href="#" className="opacity-40 hover:opacity-100 transition-opacity duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        {/* Instagram */}
        <a href="#" className="opacity-40 hover:opacity-100 transition-opacity duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        {/* Twitter (X) - Yeni Logo */}
        <a href="#" className="opacity-40 hover:opacity-100 transition-opacity duration-300">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
        </a>
      </div>
      <div className="w-[1px] h-16 bg-white/10" />
      <span className="text-white/30 text-[8px] tracking-[0.5em] font-light [writing-mode:vertical-lr] rotate-180 uppercase">
        Explore
      </span>
    </div>
  </>
);

function EditorialCard({ section, progress }: { section: typeof SECTIONS[0]; progress: MotionValue<number>; }) {
  const opacity = useTransform(progress, section.range, [0, 1, 0]);
  const y = useTransform(progress, section.range, [40, 0, -40]);

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between pt-36 pb-24 px-8 md:px-20"
      style={{ opacity, y }}
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex items-baseline gap-4">
          <h1 className="text-4xl md:text-6xl tracking-tight text-white leading-none">
            <span className="font-bold">{section.titleBold}</span>
            <span className="font-extralight text-white/50 ml-2">{section.titleLight}</span>
          </h1>
          {section.year && (
            <span className="text-white/30 text-[9px] font-mono tracking-[0.3em]">{section.year}</span>
          )}
        </div>

        {section.highlightStat && (
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xl md:text-2xl text-white/90 font-light tracking-tight">{section.highlightStat}</span>
            <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase mt-1">
              {section.highlightLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end w-full">
        <div className="max-w-xs md:max-w-sm">
          <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed mb-10 tracking-wide">
            {section.description}
          </p>
          <div className="flex items-center gap-4 text-white/80 cursor-pointer pointer-events-auto group">
            <span className="text-[9px] tracking-[0.4em] font-medium opacity-60 group-hover:opacity-100 transition-opacity uppercase">{section.buttonText}</span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-700 group-hover:scale-110">
              <span className="text-[10px]">→</span>
            </div>
          </div>
        </div>

        {section.layout === "specs-right" && section.specs && (
          <div className="hidden md:flex flex-col gap-6 mb-4">
            {section.specs.map((spec, i) => (
              <div key={i} className="flex flex-col border-b border-white/5 pb-4 w-40">
                <span className="text-white/80 text-xs font-light tracking-wide">{spec.desc}</span>
                <span className="text-white/20 text-[7px] uppercase tracking-[0.3em] mt-1.5">{spec.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TimelineProgress({ progress }: { progress: MotionValue<number>; }) {
  const activeIndexRaw = useTransform(progress, [0, 1], [1, 4.99]);
  const displayIndex = useTransform(activeIndexRaw, v => Math.floor(v));
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="absolute bottom-12 right-12 z-50 hidden md:flex items-center gap-8">
      <div className="text-white/40 font-mono text-[10px] tracking-widest flex items-center">
        <span>0</span>
        <motion.span>{displayIndex}</motion.span>
      </div>

      <div className="relative w-40 h-[1px] bg-white/10">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-white/60 origin-left"
          style={{ width: "100%", scaleX }}
        />
        <motion.div
          className="absolute top-1/2 -mt-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          style={{ left: useTransform(progress, [0, 1], ["0%", "100%"]) }}
        />
      </div>
    </div>
  );
}

export default function ErnParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 25,
    damping: 25,
    mass: 0.8,
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-[#050505] font-sans selection:bg-white selection:text-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)" }} />

        {SECTIONS.map((section) => {
          const opacity = useTransform(smoothProgress, section.range, [0, 1, 0]);
          const scale = useTransform(smoothProgress, [section.range[0], section.range[2]], [1.02, 1.08]);

          return (
            <motion.div key={section.id} className="absolute inset-0 z-0 transform-gpu" style={{ opacity }}>
              {section.type === "video" ? (
                <motion.video src={section.media} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50" style={{ scale }} />
              ) : (
                <motion.img src={section.media} className="w-full h-full object-cover opacity-50" style={{ scale }} />
              )}
            </motion.div>
          );
        })}

        <FixedUI />
        {SECTIONS.map((section) => (
          <EditorialCard key={section.id} section={section} progress={smoothProgress} />
        ))}
        <TimelineProgress progress={smoothProgress} />
      </div>
    </section>
  );
}