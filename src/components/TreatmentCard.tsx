import React, { useState, useRef, MouseEvent } from "react";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { Treatment } from "../types";

interface TreatmentCardProps {
  treatment: Treatment;
  index?: number;
  onSelectTreatment: (treatment: Treatment | null) => void;
  onOpenBooking: (treatment: Treatment) => void;
}

const TreatmentCard = React.memo(function TreatmentCard({ 
  treatment, 
  index = 0,
  onSelectTreatment, 
  onOpenBooking 
}: TreatmentCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Relative cursor position from center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const isPremiumHighlight = treatment.id === "skin-readiness" || treatment.id === "slow-skin-first";
  const isVideoConsultation = treatment.id === "videokonsultacja" || treatment.id.includes("video");

  // We shift the image gently in the opposite direction of the cursor movement to create high-fidelity parallax depth
  const shiftX = isHovered ? -mousePosition.x * 12 : 0;
  const shiftY = isHovered ? -mousePosition.y * 12 : 0;

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ 
        duration: 0.65, 
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min((index % 4) * 0.1, 0.3)
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col justify-between transition-colors duration-500 group overflow-hidden relative ${
        isVideoConsultation
          ? "bg-gradient-to-br from-white via-[#f4f7f6] to-[#eaf2ef] border-2 border-emerald-700/60 shadow-[0_16px_40px_rgba(16,185,129,0.12)]"
          : isPremiumHighlight
          ? "bg-gradient-to-br from-white via-[#faf6ee] to-[#f3ead5] border-2 border-luxury-gold shadow-[0_16px_40px_rgba(212,175,55,0.18)]"
          : "bg-white border border-luxury-sand hover:border-luxury-gold"
      }`}
    >
      {/* Elite Editorial Photo as Header of each treatment card with smooth parallax tracking */}
      <div className="aspect-[16/10] overflow-hidden bg-luxury-sand relative">
        <img 
          src={treatment.image} 
          alt={treatment.title} 
          style={{
            transform: isHovered 
              ? `scale(1.08) translate(${shiftX}px, ${shiftY}px)`
              : `scale(1) translate(0px, 0px)`,
            transition: isHovered
              ? "transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)" // smooth damping tracking
              : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)" // ultra smooth slow reset
          }}
          className="w-full h-full object-cover origin-center"
          referrerPolicy="no-referrer"
        />
        
        {/* Beautiful overlay tag for premium experience */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-xs px-3 py-1 text-[8px] font-mono tracking-[0.2em] text-luxury-dark uppercase">
          {treatment.duration}
        </div>

        {/* Floating badge for recommended first step / online consultation */}
        {isVideoConsultation ? (
          <div className="absolute top-4 right-4 z-20 bg-emerald-800 text-white px-3 py-1 text-[8.5px] font-mono tracking-[0.2em] font-bold uppercase shadow-md border border-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Online • Google Meet
          </div>
        ) : isPremiumHighlight ? (
          <div className="absolute top-4 right-4 z-20 bg-luxury-gold text-luxury-dark px-3 py-1 text-[8.5px] font-mono tracking-[0.2em] font-bold uppercase shadow-md border border-white">
            Rekomendowany Początek Terapii
          </div>
        ) : null}
      </div>

      {/* Card Content body with quiet luxury proportions */}
      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Sub-header indicators */}
          <div className="flex justify-between items-center font-mono text-[10px] text-luxury-dark/90" id={`info-row-${treatment.id}`}>
            <span className="flex items-center gap-1" id={`duration-elem-${treatment.id}`}>
              <Clock className="w-3.5 h-3.5 text-luxury-gold" /> {treatment.duration}
            </span>
            <span className={`font-semibold text-xs ${isPremiumHighlight ? "text-luxury-dark font-bold" : "text-luxury-gold"}`} id={`price-elem-${treatment.id}`}>
              {treatment.price}
            </span>
          </div>
          
          <h2 className="font-serif text-2xl font-light text-luxury-dark tracking-tight">{treatment.title}</h2>
          <p className="text-xs font-mono text-luxury-gold tracking-wide -mt-2">{treatment.subtitle}</p>
          
          <p className="text-xs text-luxury-dark/95 font-light leading-relaxed line-clamp-3">
            {treatment.description}
          </p>
          
          {/* Indications */}
          <div className="space-y-2 pt-2">
            <span className="font-mono text-[9px] text-luxury-dark/90 tracking-wider uppercase block">Głównie wskazanie:</span>
            <p className="text-[11px] text-luxury-dark/95 font-light flex items-center gap-1.5 italic font-serif">
              <span className="text-luxury-gold select-none font-sans font-normal">•</span> {treatment.indications[0]}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-luxury-sand flex items-center justify-between">
          <span className="text-[9px] font-mono text-luxury-dark/90 uppercase tracking-widest select-none">Fokus: {treatment.focus}</span>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                onSelectTreatment(treatment);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-mono tracking-widest text-luxury-gold hover:text-luxury-dark transition-colors font-medium border-b border-luxury-gold/30 hover:border-luxury-dark uppercase cursor-pointer"
              id={`detail-btn-${treatment.id}`}
            >
              Monografia Expert
            </button>
            <button 
              onClick={() => onOpenBooking(treatment)}
              className={`text-xs font-mono tracking-widest px-4 py-2 transition-all duration-300 uppercase cursor-pointer ${
                isPremiumHighlight 
                  ? "bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white font-bold shadow-sm" 
                  : "text-white bg-luxury-dark hover:bg-luxury-gold"
              }`}
            >
              Rezerwuj
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default TreatmentCard;
