import React, { useState } from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "header" | "footer" | "drawer";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "h-10 sm:h-12 w-auto", 
  variant = "header" 
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Graceful typographic fallback
    return (
      <div className="flex flex-col justify-center">
        <span className="font-serif text-lg sm:text-xl font-light tracking-wide text-luxury-dark block">
          SLOW SKIN CONCEPT
        </span>
        <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-luxury-gold uppercase block -mt-0.5 font-medium">
          INSTYTUT ZDROWEJ SKÓRY
        </span>
      </div>
    );
  }

  return (
    <img
      src="/slow-skin-logo.svg"
      alt="Instytut Zdrowej Skóry SLOW SKIN CONCEPT™"
      className={`object-contain transition-transform duration-300 ${className}`}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
