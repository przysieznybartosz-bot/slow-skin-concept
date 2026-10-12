import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info } from "lucide-react";

interface PillarTooltipProps {
  label: string;
  expansion: string;
  description: string;
}

export default function PillarTooltip({ label, expansion, description }: PillarTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span 
        className="font-mono text-xs text-luxury-gold tracking-widest uppercase border-b border-dashed border-luxury-gold/50 pb-0.5 cursor-help transition-colors hover:text-luxury-dark hover:border-luxury-dark inline-flex items-center gap-1.5 select-none"
      >
        {label}
        <Info className="w-3 h-3 text-luxury-gold/70 group-hover:text-luxury-dark transition-colors" />
      </span>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 lg:left-0 top-full mt-2 w-72 bg-[#FCFAF6] border border-luxury-sand p-5 shadow-lg z-50 rounded-none space-y-2.5 text-left pointer-events-none sm:pointer-events-auto"
          >
            {/* Tooltip elegant content */}
            <div className="space-y-1">
              <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block">
                Zrozumieć {label}
              </span>
              <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                {expansion}
              </h4>
            </div>
            
            <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
              {description}
            </p>

            <div className="border-t border-luxury-sand/40 pt-2 flex items-center justify-between text-[8px] font-mono text-luxury-dark/90 uppercase tracking-widest">
              <span>Metoda Slow Skin</span>
              <span>Filozofia nauki</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
