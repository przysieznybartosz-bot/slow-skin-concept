import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film, Compass, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoChapter {
  id: string;
  title: string;
  subtitle: string;
  poster: string;
  videoUrl?: string;
  youtubeId?: string;
  durationSeconds: number;
}

const CHAPTERS: VideoChapter[] = [
  {
    id: "ritual",
    title: "1. Seans Bionomiczny & Masaż",
    subtitle: "Rytuał wyciszający naczynia włosowate i barierę hydrolipidową",
    poster: "/src/assets/images/video_scene_facial_1786132960849.jpg",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    youtubeId: "92b_CsnqXpE",
    durationSeconds: 92,
  },
  {
    id: "lllt",
    title: "2. Fotobiomodulacja LLLT 590nm",
    subtitle: "Stymulacja syntezy ceramidów bez ogrzewania skóry",
    poster: "/src/assets/images/video_scene_lllt_1786132976505.jpg",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    youtubeId: "140R2kYjS60",
    durationSeconds: 120,
  },
  {
    id: "lab",
    title: "3. Receptury Bionomowe (0% PEG/Silikonu)",
    subtitle: "Czystość komórkowa w laboratorium Slow Skin Concept",
    poster: "/src/assets/images/video_scene_lab_1786132989115.jpg",
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    youtubeId: "dQw4w9WgXcQ",
    durationSeconds: 78,
  },
];

export const VideoPlayerSection: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [videoMode, setVideoMode] = useState<"html5" | "youtube">("html5");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const activeChapter = CHAPTERS[activeChapterIndex];

  // Ambient Spa Synthesizer Sound (432Hz theta relaxing tone when playing & unmuted)
  const startAmbientAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (!oscillatorRef.current && audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(432, audioCtxRef.current.currentTime); // 432Hz soothing healing frequency
        gain.gain.setValueAtTime(0.015, audioCtxRef.current.currentTime); // low ambient volume
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
      }
    } catch {
      // Audio not permitted or supported
    }
  };

  const stopAmbientAudio = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
            oscillatorRef.current = null;
          }
        }, 500);
      } catch {
        oscillatorRef.current = null;
      }
    }
  };

  // Video Progress Timer simulation if HTML5 video metadata isn't sending events
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      if (!isMuted) {
        startAmbientAudio();
      } else {
        stopAmbientAudio();
      }
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeChapter.durationSeconds) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      stopAmbientAudio();
    }

    return () => {
      clearInterval(interval);
      stopAmbientAudio();
    };
  }, [isPlaying, isMuted, activeChapter]);

  const togglePlay = () => {
    if (videoRef.current && videoMode === "html5") {
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
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = targetSec;
    }
  };

  const switchChapter = (index: number) => {
    setActiveChapterIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
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
          if (isPlaying) setShowControls(false);
        }}
      >
        {/* Decorative Luxury Corner Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-luxury-gold/80 z-20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-luxury-gold/80 z-20 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-luxury-gold/80 z-20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-luxury-gold/80 z-20 pointer-events-none" />

        {/* Video or Animated Scene Visual */}
        {videoMode === "html5" && (
          <video
            ref={videoRef}
            src={activeChapter.videoUrl}
            poster={activeChapter.poster}
            className="w-full h-full object-cover"
            playsInline
            muted={isMuted}
            loop
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current && videoRef.current.currentTime) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
          />
        )}

        {videoMode === "youtube" && (
          <div className="w-full h-full relative">
            <iframe
              src={`https://www.youtube.com/embed/${activeChapter.youtubeId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${activeChapter.youtubeId}&modestbranding=1&rel=0`}
              title={activeChapter.title}
              className="w-full h-full border-0 pointer-events-none"
              allow="autoplay; encrypted-media"
            />
            {/* Click overlay for Youtube mode */}
            <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />
          </div>
        )}

        {/* Fallback Image Layer when paused */}
        {!isPlaying && (
          <img
            src={activeChapter.poster}
            alt={activeChapter.title}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 pointer-events-none"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Video Overlay & Controls */}
        <AnimatePresence>
          {(!isPlaying || showControls) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 flex flex-col justify-between p-4 md:p-6 z-10 pointer-events-auto"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-center z-20">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-luxury-gold/40 rounded-full">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-luxury-gold"}`} />
                  <span className="text-[10px] font-mono tracking-widest text-white uppercase font-medium">
                    {activeChapter.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVideoMode(videoMode === "html5" ? "youtube" : "html5")}
                    className="text-[9px] font-mono tracking-wider text-luxury-cream/80 bg-black/60 hover:bg-luxury-gold hover:text-white px-2.5 py-1 border border-luxury-gold/30 rounded-full transition-all cursor-pointer uppercase flex items-center gap-1"
                  >
                    <Film className="w-3 h-3 text-luxury-gold" />
                    {videoMode === "html5" ? "Tryb HD Stream" : "Tryb Ambient YouTube"}
                  </button>
                  <span className="text-[9px] font-mono text-luxury-cream/70 tracking-widest uppercase bg-black/50 px-2 py-1 border border-white/10 rounded-xs">
                    1080p BIONOMIC
                  </span>
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-luxury-gold/80 hover:bg-luxury-gold text-white border-2 border-white/60 flex items-center justify-center backdrop-blur-md transition-all shadow-[0_0_30px_rgba(212,175,55,0.5)] pointer-events-auto cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white fill-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white fill-white translate-x-1" />
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
                    max={activeChapter.durationSeconds}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-luxury-gold h-1 bg-white/30 rounded-lg appearance-none cursor-pointer hover:bg-white/50 transition-all"
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
                      title={isMuted ? "Włącz dźwięk (Ambient 432Hz)" : "Wycisz"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
                      <span className="text-[10px] uppercase font-sans font-medium">
                        {isMuted ? "Cisza" : "Dźwięk 432Hz"}
                      </span>
                    </button>

                    <div className="text-[10px] text-white/90 bg-black/50 px-2 py-0.5 border border-white/20 rounded-xs">
                      {formatTime(currentTime)} / {formatTime(activeChapter.durationSeconds)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[10px] text-luxury-gold/90 tracking-wider uppercase font-semibold">
                      {activeChapter.subtitle}
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
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chapter Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto pt-2">
        {CHAPTERS.map((chap, idx) => {
          const isSelected = activeChapterIndex === idx;
          return (
            <button
              key={chap.id}
              onClick={() => switchChapter(idx)}
              className={`text-left p-3.5 border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? "bg-luxury-gold/15 border-luxury-gold shadow-md"
                  : "bg-white/80 border-luxury-sand/60 hover:border-luxury-gold/60 hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 rounded-xs overflow-hidden relative shrink-0 border border-luxury-gold/30">
                  <img src={chap.poster} alt={chap.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {isSelected && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    </div>
                  )}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[9px] font-mono tracking-wider text-luxury-gold uppercase font-bold block">
                    KADR WIDEO 0{idx + 1}
                  </span>
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
          <span>Autorski Rytuał Slow Skin Concept</span>
        </div>
      </div>
    </div>
  );
};
