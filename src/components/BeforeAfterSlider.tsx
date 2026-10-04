import React, { useState, useRef, useCallback, useEffect } from "react";
import { MoveHorizontal, Camera, Upload, Check, RefreshCw } from "lucide-react";
import { isEditorMode } from "../utils/editorMode";

interface BeforeAfterSliderProps {
  idBefore?: string;
  idAfter?: string;
  imageBefore: string;
  imageAfter: string;
  altBefore?: string;
  altAfter?: string;
  duration?: string;
  className?: string;
  onImageChange?: (slotId: string, newUrl: string) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  idBefore = "case_0_before",
  idAfter = "case_0_after",
  imageBefore,
  imageAfter,
  altBefore = "Stan przed terapią (problem skóry)",
  altAfter = "Stan po terapii (efekty)",
  duration,
  className = "",
  onImageChange,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const fileInputBeforeRef = useRef<HTMLInputElement>(null);
  const fileInputAfterRef = useRef<HTMLInputElement>(null);
  
  const [currentBefore, setCurrentBefore] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`custom_img_${idBefore}`);
        if (stored) return stored;
      } catch {}
    }
    return imageBefore;
  });

  const [currentAfter, setCurrentAfter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`custom_img_${idAfter}`);
        if (stored) return stored;
      } catch {}
    }
    return imageAfter;
  });

  const [uploadingSlot, setUploadingSlot] = useState<"before" | "after" | null>(null);
  const [successSlot, setSuccessSlot] = useState<"before" | "after" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBefore = localStorage.getItem(`custom_img_${idBefore}`);
      if (storedBefore) {
        setCurrentBefore(storedBefore);
      } else {
        setCurrentBefore(imageBefore);
      }

      const storedAfter = localStorage.getItem(`custom_img_${idAfter}`);
      if (storedAfter) {
        setCurrentAfter(storedAfter);
      } else {
        setCurrentAfter(imageAfter);
      }
    } else {
      setCurrentBefore(imageBefore);
      setCurrentAfter(imageAfter);
    }
  }, [idBefore, idAfter, imageBefore, imageAfter]);

  const handleUpload = async (file: File, slot: "before" | "after") => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Proszę wybrać plik graficzny (PNG, JPG, WEBP).");
      return;
    }

    const slotKey = slot === "before" ? idBefore : idAfter;

    try {
      setUploadingSlot(slot);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const resp = await fetch("/api/upload-treatment-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataUrl: base64,
              treatmentKey: slotKey,
            }),
          });
          const data = await resp.json();
          const targetUrl = data.success && data.url ? data.url : base64;

          try {
            localStorage.setItem(`custom_img_${slotKey}`, targetUrl);
          } catch {}

          if (slot === "before") {
            setCurrentBefore(targetUrl);
          } else {
            setCurrentAfter(targetUrl);
          }

          setSuccessSlot(slot);
          if (onImageChange) {
            onImageChange(slotKey, targetUrl);
          }

          setTimeout(() => {
            setSuccessSlot(null);
          }, 3500);
        } catch {
          // Fallback to localStorage
          try {
            localStorage.setItem(`custom_img_${slotKey}`, base64);
          } catch {}
          if (slot === "before") {
            setCurrentBefore(base64);
          } else {
            setCurrentAfter(base64);
          }
          setSuccessSlot(slot);
          if (onImageChange) {
            onImageChange(slotKey, base64);
          }
          setTimeout(() => {
            setSuccessSlot(null);
          }, 3500);
        } finally {
          setUploadingSlot(null);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingSlot(null);
    }
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const canEdit = isEditorMode();

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {/* Hidden file inputs for editor mode */}
      {canEdit && (
        <>
          <input
            type="file"
            ref={fileInputBeforeRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0], "before");
              }
            }}
          />
          <input
            type="file"
            ref={fileInputAfterRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0], "after");
              }
            }}
          />
        </>
      )}

      {/* Main Container */}
      <div
        ref={containerRef}
        className="relative aspect-square bg-[#1a1713] overflow-hidden border border-luxury-gold/40 shadow-2xl group select-none touch-none cursor-ew-resize"
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches.length > 0) handleMove(e.touches[0].clientX);
        }}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Decorative corner hair lines */}
        <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-luxury-gold/70 z-30 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-luxury-gold/70 z-30 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-luxury-gold/70 z-30 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-luxury-gold/70 z-30 pointer-events-none" />

        {/* Header indicator */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-[#12110f]/90 border border-luxury-gold/40 text-luxury-cream text-[9px] font-mono tracking-[0.18em] uppercase px-3 py-1.5 backdrop-blur-md shadow-md">
          {sliderPosition > 80
            ? "100% PRZED TERAPIĄ"
            : sliderPosition < 20
            ? "100% PO TERAPII (EFEKT)"
            : "PORÓWNANIE PRZED / PO"}
        </div>

        {duration && (
          <div className="absolute top-4 right-4 z-20 pointer-events-none bg-luxury-gold text-white text-[9px] font-mono tracking-[0.18em] uppercase px-3 py-1.5 font-semibold shadow-md">
            {duration}
          </div>
        )}

        {/* Uploading Spinner Overlay */}
        {uploadingSlot && (
          <div className="absolute inset-0 z-40 bg-white/90 text-luxury-dark flex flex-col items-center justify-center p-4 text-center backdrop-blur-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-luxury-gold mb-2" />
            <p className="font-mono text-xs uppercase tracking-wider font-bold">
              Zapisywanie zdjęcia {uploadingSlot === "before" ? "PRZED" : "PO"}...
            </p>
          </div>
        )}

        {/* 
          BASE LAYER (Bottom - BEFORE / PRZED TERAPIĄ - Problem skóry):
          Covers 100% of container frame.
        */}
        <img
          src={currentBefore}
          alt={altBefore}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          referrerPolicy="no-referrer"
        />
        <span className="absolute bottom-4 left-4 z-10 text-[10px] font-mono tracking-widest text-white/90 bg-black/60 px-2.5 py-1 border border-white/20 uppercase pointer-events-none backdrop-blur-xs">
          PRZED
        </span>

        {/* 
          TOP LAYER (Top - AFTER / PO TERAPII - Zregenerowana skóra):
          Clipped from the right side according to slider position so sliding right reveals cleared skin!
        */}
        <img
          src={currentAfter}
          alt={altAfter}
          className="absolute inset-0 w-full h-full object-cover object-center z-10"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
          referrerPolicy="no-referrer"
        />
        <span
          className="absolute bottom-4 right-4 z-10 text-[10px] font-mono tracking-widest text-white/90 bg-black/60 px-2.5 py-1 border border-white/20 uppercase pointer-events-none backdrop-blur-xs transition-opacity duration-200"
          style={{ opacity: sliderPosition > 10 ? 1 : 0 }}
        >
          PO (EFEKTY)
        </span>

        {/* Vertical divider line and handle */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Golden vertical line */}
          <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-luxury-gold shadow-[0_0_12px_rgba(212,175,55,0.9)]" />

          {/* Circular handle */}
          <div className="absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 rounded-full bg-luxury-dark border-2 border-luxury-gold text-luxury-gold flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform duration-200">
            <MoveHorizontal className="w-5 h-5 text-luxury-gold" />
          </div>
        </div>

        {/* Floating guidance tooltip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 text-white/90 text-[9px] font-mono tracking-widest px-3 py-1 border border-luxury-gold/40 rounded-full pointer-events-none uppercase opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
          <MoveHorizontal className="w-3 h-3 text-luxury-gold inline" />
          PRZESUŃ SUWAK PRZED / PO
        </div>
      </div>

      {/* Editor mode toolbar: quick photo change buttons for Before and After */}
      {canEdit && (
        <div className="flex items-center justify-between gap-2 p-2 bg-luxury-dark/95 border border-luxury-gold/50 rounded-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputBeforeRef.current?.click();
            }}
            className={`flex-1 py-1 px-2 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 rounded-2xs border cursor-pointer ${
              successSlot === "before"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white/10 hover:bg-white/20 text-white border-luxury-gold/40 hover:border-luxury-gold"
            }`}
            title="Kliknij, aby podmienić zdjęcie PRZED dla tego przypadku"
          >
            {successSlot === "before" ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Zmieniono PRZED!</span>
              </>
            ) : (
              <>
                <Camera className="w-3 h-3 text-luxury-gold" />
                <span>Zmień zdjęcie: PRZED</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputAfterRef.current?.click();
            }}
            className={`flex-1 py-1 px-2 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 rounded-2xs border cursor-pointer ${
              successSlot === "after"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white/10 hover:bg-white/20 text-white border-luxury-gold/40 hover:border-luxury-gold"
            }`}
            title="Kliknij, aby podmienić zdjęcie PO dla tego przypadku"
          >
            {successSlot === "after" ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Zmieniono PO!</span>
              </>
            ) : (
              <>
                <Camera className="w-3 h-3 text-luxury-gold" />
                <span>Zmień zdjęcie: PO</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={() => setSliderPosition(100)}
          className={`flex-1 py-1.5 text-[9.5px] font-mono tracking-wider uppercase text-center border transition-all cursor-pointer ${
            sliderPosition === 100
              ? "bg-luxury-gold text-white border-luxury-gold font-semibold shadow-xs"
              : "bg-white text-luxury-dark border-luxury-sand/60 hover:border-luxury-gold hover:text-luxury-dark"
          }`}
        >
          100% PRZED
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(50)}
          className={`flex-1 py-1.5 text-[9.5px] font-mono tracking-wider uppercase text-center border transition-all cursor-pointer ${
            sliderPosition === 50
              ? "bg-luxury-gold text-white border-luxury-gold font-semibold shadow-xs"
              : "bg-white text-luxury-dark border-luxury-sand/60 hover:border-luxury-gold hover:text-luxury-dark"
          }`}
        >
          50% / 50%
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(0)}
          className={`flex-1 py-1.5 text-[9.5px] font-mono tracking-wider uppercase text-center border transition-all cursor-pointer ${
            sliderPosition === 0
              ? "bg-luxury-gold text-white border-luxury-gold font-semibold shadow-xs"
              : "bg-white text-luxury-dark border-luxury-sand/60 hover:border-luxury-gold hover:text-luxury-dark"
          }`}
        >
          100% PO (EFEKTY)
        </button>
      </div>
    </div>
  );
};
