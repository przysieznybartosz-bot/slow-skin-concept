import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Compass, ShieldCheck, Clock, RotateCcw, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoThumbnailCard {
  id: string;
  title: string;
  subtitle: string;
  poster: string;
  badge: string;
  description: string;
}

const THUMBNAIL_CARDS: VideoThumbnailCard[] = [
  {
    id: "ritual",
    title: "1. Seans Bionomiczny & Masaż",
    subtitle: "Rytuał wyciszający naczynia włosowate i barierę hydrolipidową",
    poster: "/src/assets/images/video_scene_facial_1786132960849.jpg",
    badge: "KADR WIDEO 01",
    description: "Autorski masaż powięziowy i sensoryczne wyciszenie układu nerwowego naskórka."
  },
  {
    id: "lllt",
    title: "2. Fotobiomodulacja LLLT 590nm",
    subtitle: "Stymulacja syntezy ceramidów bez ogrzewania skóry",
    poster: "/src/assets/images/video_scene_lllt_1786132976505.jpg",
    badge: "KADR WIDEO 02",
    description: "Światłoterapia medyczna wspierająca regenerację na poziomie mitochondrialnym."
  },
  {
    id: "lab",
    title: "3. Receptury Bionomowe (0% PEG/Silikonu)",
    subtitle: "Czystość komórkowa w laboratorium Slow Skin Concept",
    poster: "/src/assets/images/video_scene_lab_1786132989115.jpg",
    badge: "KADR WIDEO 03",
    description: "Czyste formulacje gabinetowe i domowe zgodne z zasadą bionomicznej harmonii biologicznej."
  },
];

const MAIN_REEL = {
  title: "Autorski Model Pracy ze Skórą — Katarzyna Brzezińska",
  subtitle: "Biologiczna Terapia Skóry & Marka Skin Infusion™",
  durationSeconds: 29,
  videoUrl: "/videos/rolka-glowna.mp4",
  poster: "/src/assets/images/video_scene_facial_1786132960849.jpg",
  quote: "„Skóra zmienia się każdego dnia. Czasem potrzebuje ukojenia, czasem odbudowy, a czasem precyzyjnej stymulacji. W moim Instytucie Zdrowej Skóry najpierw poznaję jej aktualne potrzeby. Dobieram zabiegi i komponuję spersonalizowaną pielęgnację domową, tak aby wzajemnie się uzupełniały.”",
  author: "Katarzyna Brzezińska — Twórczyni Slow Skin Concept & Skin Infusion"
};

export const VideoPlayerSection: React.FC = () => {
  const [selectedThumbnail, setSelectedThumbnail] = useState<VideoThumbnailCard | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Synchronize audio state with HTML5 video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (selectedThumbnail) {
      // Return to main reel and play
      setSelectedThumbnail(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(true));
        }
      }, 100);
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(true);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetSec = parseFloat(e.target.value);
    setCurrentTime(targetSec);
    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
      videoRef.current.currentTime = targetSec;
    }
  };

  const handleThumbnailClick = (card: VideoThumbnailCard) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setSelectedThumbnail(card);
  };

  const backToMainReel = () => {
    setSelectedThumbnail(null);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="space-y-6 pt-10 pb-6 border-t border-luxury-sand/30" id="metamorphosis-video-section">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
          <Sparkles className="w-3 h-3 text-luxury-gold" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-semibold">
            Prezentacja Wideo HD
          </span>
        </div>
        <h3 className="font-serif text-[32px] md:text-[38px] font-light text-luxury-dark leading-tight">
          Wizualny Rytuał Slow Skin Concept
        </h3>
        <p className="text-[12px] leading-relaxed text-luxury-dark/95 font-serif italic max-w-lg mx-auto">
          Zobacz wnętrze gabinetu, poznaj autorską czystość bionomiczną oraz poczuj kojącą uważność, z jaką pielęgnujemy reaktywną skórę.
        </p>
      </div>

      {/* Main Video Frame Container */}
      <div
        className="relative w-full max-w-5xl mx-auto aspect-video md:aspect-[21/9] bg-[#0f0e0c] border border-luxury-gold/40 overflow-hidden shadow-2xl group transition-all duration-500 rounded-sm"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (isPlaying && !selectedThumbnail) setShowControls(false);
        }}
      >
        {/* Decorative Luxury Corner Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-luxury-gold/80 z-20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-luxury-gold/80 z-20 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-luxury-gold/80 z-20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-luxury-gold/80 z-20 pointer-events-none" />

        {/* Video Player or Thumbnail Preview Mode */}
        {!selectedThumbnail ? (
          <video
            ref={videoRef}
            src={MAIN_REEL.videoUrl}
            poster={MAIN_REEL.poster}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            loop
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current && Number.isFinite(videoRef.current.currentTime)) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={selectedThumbnail.poster}
              alt={selectedThumbnail.title}
              className="w-full h-full object-cover brightness-75"
            />
            {/* Overlay informing that video is coming soon */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3 z-15">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/20 border border-luxury-gold/60 text-luxury-gold font-mono text-[10px] tracking-widest uppercase rounded-full">
                <Clock className="w-3 h-3" />
                {selectedThumbnail.badge} · Wideo wkrótce
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-white font-light max-w-lg">
                {selectedThumbnail.title}
              </h4>
              <p className="text-xs sm:text-sm text-luxury-cream/80 font-light max-w-md italic">
                {selectedThumbnail.subtitle}
              </p>
              <p className="text-[11px] text-white/70 font-mono max-w-sm pt-1">
                Materiał filmowy z tego etapu jest obecnie w montażu. Wkrótce udostępnimy pełny reportaż wideo.
              </p>
              <button
                onClick={backToMainReel}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-dark font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Odtwórz Rolkę Główną Instytutu
              </button>
            </div>
          </div>
        )}

        {/* Video Overlay & Controls for Main Reel */}
        {!selectedThumbnail && (
          <AnimatePresence>
            {(!isPlaying || showControls) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45 flex flex-col justify-between p-4 md:p-6 z-10 pointer-events-auto"
              >
                {/* Top Bar */}
                <div className="flex justify-between items-center z-20">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-luxury-gold/40 rounded-full">
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-luxury-gold"}`} />
                    <span className="text-[10px] font-mono tracking-widest text-white uppercase font-medium">
                      Film Główny · Rolka Instytutu
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-luxury-cream/80 tracking-widest uppercase bg-black/50 px-2.5 py-1 border border-white/10 rounded-xs">
                      HD BIONOMIC
                    </span>
                  </div>
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-luxury-gold/85 hover:bg-luxury-gold text-luxury-dark border-2 border-white/60 flex items-center justify-center backdrop-blur-md transition-all shadow-[0_0_35px_rgba(212,175,55,0.6)] pointer-events-auto cursor-pointer"
                    aria-label={isPlaying ? "Wstrzymaj film" : "Odtwórz film"}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-luxury-dark fill-luxury-dark" />
                    ) : (
                      <Play className="w-8 h-8 text-luxury-dark fill-luxury-dark translate-x-0.5" />
                    )}
                  </motion.button>
                </div>

                {/* Bottom Control Bar */}
                <div className="space-y-2 z-20" onClick={(e) => e.stopPropagation()}>
                  {/* Progress Bar Scrub */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max={MAIN_REEL.durationSeconds}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-luxury-gold h-1 bg-white/30 rounded-lg appearance-none cursor-pointer hover:bg-white/50 transition-all"
                      aria-label="Pasek postępu wideo"
                    />
                  </div>

                  {/* Controls & Timestamp */}
                  <div className="flex justify-between items-center text-white text-[11px] font-mono">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="hover:text-luxury-gold transition-colors text-white cursor-pointer flex items-center gap-1.5"
                        title={isPlaying ? "Pauza" : "Odtwórz"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                        <span className="text-[10px] uppercase font-sans font-medium">{isPlaying ? "Pauza" : "Odtwórz"}</span>
                      </button>

                      <button
                        onClick={toggleMute}
                        className="hover:text-luxury-gold transition-colors text-white cursor-pointer flex items-center gap-1.5"
                        title={isMuted ? "Włącz dźwięk rolki" : "Wycisz"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                        <span className="text-[10px] uppercase font-sans font-medium">
                          {isMuted ? "Dźwięk wyłączony" : "Dźwięk włączony"}
                        </span>
                      </button>

                      <div className="text-[10px] text-white/90 bg-black/50 px-2 py-0.5 border border-white/20 rounded-xs">
                        {formatTime(currentTime)} / {formatTime(MAIN_REEL.durationSeconds)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline text-[10px] text-luxury-gold/90 tracking-wider uppercase font-semibold">
                        {MAIN_REEL.subtitle}
                      </span>
                      <button
                        onClick={() => {
                          const el = document.getElementById("metamorphosis-video-section");
                          if (el && el.requestFullscreen) {
                            el.requestFullscreen();
                          }
                        }}
                        className="hover:text-luxury-gold text-white cursor-pointer transition-colors"
                        title="Pełny ekran"
                        aria-label="Pełny ekran"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Quote Banner from the Official Reel */}
      <div className="max-w-5xl mx-auto bg-luxury-cream border border-luxury-sand/60 p-4 md:p-5 rounded-sm flex items-start gap-3.5 shadow-2xs">
        <Quote className="w-5 h-5 text-luxury-gold shrink-0 mt-0.5 rotate-180" />
        <div className="space-y-1">
          <p className="font-serif italic text-xs md:text-sm text-luxury-dark/95 leading-relaxed">
            {MAIN_REEL.quote}
          </p>
          <span className="font-mono text-[9px] tracking-wider text-luxury-gold uppercase font-semibold block">
            — {MAIN_REEL.author}
          </span>
        </div>
      </div>

      {/* Chapter Thumbnail Selection Cards — Pure Thumbnails Only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto pt-1">
        {THUMBNAIL_CARDS.map((chap) => {
          const isSelected = selectedThumbnail?.id === chap.id;
          return (
            <button
              key={chap.id}
              onClick={() => handleThumbnailClick(chap)}
              className={`text-left p-3.5 border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? "bg-luxury-gold/15 border-luxury-gold shadow-md"
                  : "bg-white/80 border-luxury-sand/60 hover:border-luxury-gold/60 hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 rounded-xs overflow-hidden relative shrink-0 border border-luxury-gold/30">
                  <img src={chap.poster} alt={chap.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <span className="text-[8px] font-mono text-white/90 bg-black/60 px-1 py-0.5 rounded-2xs">KADR</span>
                  </div>
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-wider text-luxury-gold uppercase font-bold block">
                      {chap.badge}
                    </span>
                    <span className="text-[8px] font-mono text-luxury-dark/60 tracking-tight uppercase bg-luxury-sand/30 px-1 py-0.5">
                      Wkrótce
                    </span>
                  </div>
                  <h4 className="font-serif text-[13px] font-semibold text-luxury-dark truncate">{chap.title}</h4>
                  <p className="text-[10px] text-luxury-dark/95 font-serif line-clamp-1 italic">{chap.subtitle}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bionomic Quality Assurance Badge */}
      <div className="flex items-center justify-center gap-6 pt-2 text-[10px] font-mono text-luxury-dark/95 tracking-wider uppercase">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
          <span>Gwarancja Bionomicznej Czystości</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-luxury-gold" />
          <span>Autorski Model Pracy ze Skórą</span>
        </div>
      </div>
    </div>
  );
};
