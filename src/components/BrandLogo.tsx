import React, { useState } from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "header" | "footer" | "drawer";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "h-7 sm:h-8 md:h-8.5 lg:h-9 w-auto", 
  variant = "header" 
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Graceful typographic fallback
    return (
      <div className="flex flex-col justify-center select-none">
        <span className="font-serif text-sm sm:text-base md:text-lg font-light tracking-wide text-luxury-dark block whitespace-nowrap">
          SLOW SKIN CONCEPT
        </span>
        <span className="font-mono text-[7px] sm:text-[8px] tracking-[0.25em] text-luxury-gold uppercase block -mt-0.5 font-medium whitespace-nowrap">
          INSTYTUT ZDROWEJ SKÓRY
        </span>
      </div>
    );
  }

  return (
    <img
      src="/slow-skin-logo.svg"
      alt="Instytut Zdrowej Skóry SLOW SKIN CONCEPT"
      className={`object-contain object-left transition-all duration-300 ${className}`}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
