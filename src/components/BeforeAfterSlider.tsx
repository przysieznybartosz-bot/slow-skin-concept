import React, { useState, useRef, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  imageBefore: string;
  imageAfter: string;
  altBefore?: string;
  altAfter?: string;
  duration?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  imageBefore,
  imageAfter,
  altBefore = "Stan przed terapią (problem skóry)",
  altAfter = "Stan po terapii (efekty)",
  duration,
  className = "",
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
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

        {/* 
          BASE LAYER (Bottom - BEFORE / PRZED TERAPIĄ - Problem skóry):
          Covers 100% of container frame.
        */}
        <img
          src={imageBefore}
          alt={altBefore}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          referrerPolicy="no-referrer"
        />
        <span className="absolute bottom-4 left-4 z-10 text-[10px] font-mono tracking-widest text-white/90 bg-black/60 px-2.5 py-1 border border-white/20 uppercase pointer-events-none backdrop-blur-xs">
          PRZED TERAPIĄ (PROBLEM)
        </span>

        {/* 
          TOP LAYER (Top - AFTER / PO TERAPII - Zregenerowana skóra):
          Clipped from the right side according to slider position so sliding right reveals cleared skin!
        */}
        <img
          src={imageAfter}
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
          PO (EFEKT)
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
