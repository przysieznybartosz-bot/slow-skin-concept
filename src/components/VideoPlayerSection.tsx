import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Compass, ShieldCheck, Quote, Upload, Video, Camera, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { isEditorMode } from "../utils/editorMode";

export const VideoPlayerSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("custom_main_video_url");
        if (stored) return stored;
      } catch {}
    }
    return "/videos/rolka-glowna.mp4";
  });

  const [posterSrc, setPosterSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("custom_main_video_poster");
        if (stored) return stored;
      } catch {}
    }
    return "/video_thumbnail.jpg";
  });

  const [duration, setDuration] = useState<number>(29);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Synchronize audio state with HTML5 video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
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

  const handleVideoUpload = async (file: File) => {
    if (!file || !file.type.startsWith("video/")) {
      alert("Proszę wybrać plik wideo w formacie MP4.");
      return;
    }

    try {
      setIsUploadingVideo(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const resp = await fetch("/api/upload-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataUrl: base64,
              filename: "rolka-glowna.mp4"
            }),
          });
          const data = await resp.json();
          const targetUrl = data.success && data.url ? data.url : base64;

          try {
            localStorage.setItem("custom_main_video_url", targetUrl);
          } catch {}

          setVideoSrc(targetUrl);
          setUploadSuccess("Wideo wgrane pomyślnie!");
          setTimeout(() => setUploadSuccess(null), 4000);
        } catch {
          // Local fallback
          try {
            localStorage.setItem("custom_main_video_url", base64);
          } catch {}
          setVideoSrc(base64);
          setUploadSuccess("Wideo zapisane lokalnie!");
          setTimeout(() => setUploadSuccess(null), 4000);
        } finally {
          setIsUploadingVideo(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingVideo(false);
    }
  };

  const handlePosterUpload = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Proszę wybrać plik graficzny (JPG, PNG, WEBP).");
      return;
    }

    try {
      setIsUploadingVideo(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const resp = await fetch("/api/upload-treatment-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataUrl: base64,
              treatmentKey: "video_thumbnail"
            }),
          });
          const data = await resp.json();
          const targetUrl = data.success && data.url ? data.url : base64;

          try {
            localStorage.setItem("custom_main_video_poster", targetUrl);
          } catch {}

          setPosterSrc(targetUrl);
          setUploadSuccess("Miniatura zmieniona pomyślnie!");
          setTimeout(() => setUploadSuccess(null), 4000);
        } catch {
          try {
            localStorage.setItem("custom_main_video_poster", base64);
          } catch {}
          setPosterSrc(base64);
          setUploadSuccess("Miniatura zapisana!");
          setTimeout(() => setUploadSuccess(null), 4000);
        } finally {
          setIsUploadingVideo(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingVideo(false);
    }
  };

  const canEdit = isEditorMode();

  return (
    <div className="space-y-6 pt-10 pb-6 border-t border-luxury-sand/30" id="metamorphosis-video-section">
      {/* Hidden file inputs for editor mode */}
      {canEdit && (
        <>
          <input
            type="file"
            ref={videoInputRef}
            accept="video/mp4,video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleVideoUpload(e.target.files[0]);
              }
            }}
          />
          <input
            type="file"
            ref={posterInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handlePosterUpload(e.target.files[0]);
              }
            }}
          />
        </>
      )}

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

      {/* Editor toolbar for video and thumbnail upload */}
      {canEdit && (
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 p-3 bg-luxury-dark text-white border border-luxury-gold/50 rounded-xs shadow-md">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-luxury-gold" />
            <span className="font-mono text-[10px] tracking-wider uppercase">Zarządzanie materiałem wideo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploadingVideo}
              className="px-3 py-1.5 bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-dark font-mono text-[9px] tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3 h-3" />
              <span>Wgraj plik wideo (MP4)</span>
            </button>

            <button
              type="button"
              onClick={() => posterInputRef.current?.click()}
              disabled={isUploadingVideo}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-[9px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3 h-3 text-luxury-gold" />
              <span>Zmień miniaturę (kadr)</span>
            </button>
          </div>

          {uploadSuccess && (
            <div className="w-full flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] pt-1">
              <Check className="w-3.5 h-3.5" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>
      )}

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

        {/* Uploading overlay */}
        {isUploadingVideo && (
          <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center text-white space-y-2 backdrop-blur-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-luxury-gold" />
            <span className="font-mono text-xs uppercase tracking-widest">Przetwarzanie pliku wideo...</span>
          </div>
        )}

        {/* Video Player */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          className="w-full h-full object-cover"
          playsInline
          muted={isMuted}
          loop
          onClick={togglePlay}
          onLoadedMetadata={() => {
            if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
              setDuration(Math.round(videoRef.current.duration));
            }
          }}
          onTimeUpdate={() => {
            if (videoRef.current && Number.isFinite(videoRef.current.currentTime)) {
              setCurrentTime(videoRef.current.currentTime);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Video Overlay & Controls for Main Reel */}
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
                    HD VIDEO
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
                    max={duration}
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
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[10px] text-luxury-gold/90 tracking-wider uppercase font-semibold">
                      Biologiczna Terapia Skóry &amp; Marka Skin Infusion™
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
      </div>

      {/* Quote Banner from the Official Reel */}
      <div className="max-w-5xl mx-auto bg-luxury-cream border border-luxury-sand/60 p-4 md:p-5 rounded-sm flex items-start gap-3.5 shadow-2xs">
        <Quote className="w-5 h-5 text-luxury-gold shrink-0 mt-0.5 rotate-180" />
        <div className="space-y-1">
          <p className="font-serif italic text-xs md:text-sm text-luxury-dark/95 leading-relaxed">
            „Skóra zmienia się każdego dnia. Czasem potrzebuje ukojenia, czasem odbudowy, a czasem precyzyjnej stymulacji. W moim Instytucie Zdrowej Skóry najpierw poznaję jej aktualne potrzeby. Dobieram zabiegi i komponuję spersonalizowaną pielęgnację domową, tak aby wzajemnie się uzupełniały.”
          </p>
          <span className="font-mono text-[9px] tracking-wider text-luxury-gold uppercase font-semibold block">
            — Katarzyna Brzezińska — Twórczyni Slow Skin Concept &amp; Skin Infusion
          </span>
        </div>
      </div>

      {/* Quality Assurance Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[10px] font-mono text-luxury-dark/95 tracking-wider uppercase font-semibold">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
          <span>INDYWIDUALNY DOBÓR PIELĘGNACJI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-luxury-gold" />
          <span>UWAŻNA PRACA ZE SKÓRĄ</span>
        </div>
      </div>
    </div>
  );
};
