import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   VERİ YAPILANDIRMASI (FİNAL VİDEO EN SONA ALINDI)
   ═══════════════════════════════════════════════════════════════ */

const SECTIONS = [
  {
    id: "01",
    media: "/stadvideo1.mp4", // İlk bölüm orijinal video ile başlıyor
    type: "video",
    year: "2026",
    highlightStat: "120.000m²",
    highlightLabel: "Toplam Alan",
    titleBold: "Ankara",
    titleLight: "19Mayıs",
    description: "Şehrin kalbinde yeni nesil bir atmosfer ve ekstrem performans odaklı mimari.",
    buttonText: "Projeyi keşfet",
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
    buttonText: "Tasarımı incele",
    layout: "left-focus",
    range: [0.20, 0.45, 0.55],
  },
  {
    id: "03",
    media: "/image7.jpg",
    type: "image",
    titleBold: "Statik",
    titleLight: "Mühendislik",
    description: "Kusursuz rüzgar analizi ve yenilikçi çelik strüktür ile sürdürülebilir bir mükemmellik.",
    buttonText: "Mühendisliği keşfet",
    layout: "specs-right",
    range: [0.45, 0.70, 0.80],
    specs: [
      { title: "KABUK", desc: "ETFE Membran" },
      { title: "RÜZGAR DİRENCİ", desc: "Aero-Optimize" },
      { title: "ÇATI", desc: "Açılır Kapanır Strüktür" },
      { title: "AYDINLATMA", desc: "RGBW Matrix" }
    ]
  },
  {
    id: "04",
    media: "/hero_video.mp4", // <-- YENİ SİNEMATİK VİDEO BURAYA (FİNALE) GELDİ
    type: "video",
    titleBold: "İç Saha",
    titleLight: "Atmosferi",
    description: "Devasa akustik derinlik ve kesintisiz görüş alanıyla sahaya hükmeden odak tasarımı.",
    buttonText: "Finali hisset",
    layout: "left-focus",
    range: [0.70, 0.90, 1.0],
    highlightStat: "45,000",
    highlightLabel: "Maksimum Kapasite",
  },
];

/* ═══════════════════════════════════════════════════════════════
   BİLEŞENLER
   ═══════════════════════════════════════════════════════════════ */

// 1. SABİT ARAYÜZ (ERN HOLDING LOGOSU)
const FixedUI = () => (
  <>
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-12 md:py-8 pointer-events-none">
      <div className="flex items-center gap-5">
        <img
          src="/ern_holding.png"
          alt="Ern Holding"
          className="h-8 md:h-10 w-auto object-contain drop-shadow-md"
        />
        <div className="hidden md:block h-5 w-[1px] bg-white/20" />
        <span className="hidden md:block text-white/50 font-light text-[9px] tracking-[0.3em] uppercase mt-0.5">
          19 Mayıs Stadyumu Projesi
        </span>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        <span className="text-white/70 text-sm font-medium">TR <span className="text-[10px]">▼</span></span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <button className="border border-white/20 text-white px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-white hover:text-black transition-colors duration-300">
          İletişime Geç
        </button>
      </div>
    </header>

    <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-8 hidden md:flex pointer-events-none">
      <div className="flex flex-col gap-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </div>
      <div className="w-[1px] h-12 bg-white/20" />
      <span className="text-white/40 text-[10px] tracking-[0.3em] font-mono [writing-mode:vertical-lr] rotate-180">
        SCROLL
      </span>
    </div>
  </>
);

// 2. EDİTORYAL İÇERİK KARTI
function EditorialCard({ section, progress }: { section: typeof SECTIONS[0]; progress: MotionValue<number>; }) {
  const opacity = useTransform(progress, section.range, [0, 1, 0]);
  const y = useTransform(progress, section.range, [60, 0, -60]);

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between pt-32 pb-20 px-8 md:px-16"
      style={{ opacity, y }}
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex items-start gap-4">
          <h1 className="text-5xl md:text-7xl tracking-tighter text-white">
            <span className="font-bold">{section.titleBold}</span>
            <span className="font-light text-white/70">{section.titleLight}</span>
          </h1>
          {section.year && (
            <span className="text-white/50 text-sm font-medium mt-2">{section.year}</span>
          )}
        </div>

        {section.highlightStat && (
          <div className="hidden md:flex flex-col items-end text-right mr-24">
            <span className="text-2xl md:text-3xl text-white font-medium">{section.highlightStat}</span>
            <span className="text-white/40 text-[10px] tracking-wider uppercase mt-1">
              {section.highlightLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end w-full">
        <div className="max-w-xs md:max-w-sm">
          <p className="text-white/80 text-lg md:text-2xl font-light leading-snug mb-8">
            {section.description}
          </p>
          <div className="flex items-center gap-3 text-white cursor-pointer pointer-events-auto group">
            <span className="text-sm font-medium">{section.buttonText}</span>
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <span className="text-xs">→</span>
            </div>
          </div>
        </div>

        {section.layout === "specs-right" && section.specs && (
          <div className="hidden md:flex flex-col gap-6 mr-24 mb-12">
            {section.specs.map((spec, i) => (
              <div key={i} className="flex flex-col border-b border-white/10 pb-4 w-48">
                <span className="text-white text-lg font-medium tracking-wide">{spec.desc}</span>
                <span className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{spec.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// 3. ALT PROGRESS BAR
function TimelineProgress({ progress }: { progress: MotionValue<number>; }) {
  const activeIndexRaw = useTransform(progress, [0, 1], [1, 4.99]);
  const displayIndex = useTransform(activeIndexRaw, v => Math.floor(v));
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="absolute bottom-12 right-12 z-50 hidden md:flex items-center gap-6">
      <div className="text-white font-mono text-sm flex">
        <span>0</span>
        <motion.span>{displayIndex}</motion.span>
      </div>

      <div className="relative w-48 h-[1px] bg-white/20">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-white origin-left"
          style={{ width: "100%", scaleX }}
        />
        <motion.div
          className="absolute top-1/2 -mt-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
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
    stiffness: 30,
    damping: 20,
    mass: 0.5,
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-[#0a0a0a] font-sans selection:bg-white selection:text-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#111]">

        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.8) 100%)" }} />

        {SECTIONS.map((section) => {
          const opacity = useTransform(smoothProgress, section.range, [0, 1, 0]);
          const scale = useTransform(smoothProgress, [section.range[0], section.range[2]], [1.0, 1.05]);

          return (
            <motion.div key={section.id} className="absolute inset-0 z-0 will-change-[opacity,transform] transform-gpu" style={{ opacity }}>
              {section.type === "video" ? (
                <motion.video src={section.media} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" style={{ scale }} />
              ) : (
                <motion.img src={section.media} className="w-full h-full object-cover opacity-60" style={{ scale }} />
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