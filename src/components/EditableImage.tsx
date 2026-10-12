import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Check, RefreshCw } from "lucide-react";
import { isEditorMode } from "../utils/editorMode";

export interface EditableImageProps {
  id: string;
  slotName: string;
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  onImageChange?: (id: string, newUrl: string) => void;
  aspectRatioClass?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  slotName,
  src,
  fallbackSrc,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "relative overflow-hidden group",
  children,
  onImageChange,
  aspectRatioClass = "aspect-[16/10]"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`custom_img_${id}`);
        if (stored) return stored;
      } catch {}
    }
    return src || fallbackSrc || "";
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`custom_img_${id}`);
      if (src && (src.includes("?v=") || src.startsWith("data:") || src !== fallbackSrc)) {
        setCurrentSrc(src);
      } else if (stored) {
        setCurrentSrc(stored);
      } else if (src) {
        setCurrentSrc(src);
      }
    } else if (src) {
      setCurrentSrc(src);
    }
  }, [src, id, fallbackSrc]);

  const handleUpload = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Proszę wybrać plik graficzny (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const resp = await fetch("/api/upload-treatment-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataUrl: base64,
              treatmentKey: id
            })
          });
          const data = await resp.json();
          const targetUrl = data.success && data.url ? data.url : base64;

          try {
            localStorage.setItem(`custom_img_${id}`, targetUrl);
          } catch {}

          setCurrentSrc(targetUrl);
          setIsSuccess(true);
          if (onImageChange) {
            onImageChange(id, targetUrl);
          }

          setTimeout(() => {
            setIsSuccess(false);
          }, 3500);
        } catch (err) {
          console.error(err);
          // Fallback to local storage base64
          try {
            localStorage.setItem(`custom_img_${id}`, base64);
          } catch {}
          setCurrentSrc(base64);
          setIsSuccess(true);
          if (onImageChange) {
            onImageChange(id, base64);
          }
          setTimeout(() => {
            setIsSuccess(false);
          }, 3500);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const canEdit = isEditorMode();

  return (
    <div
      className={`${containerClassName} ${aspectRatioClass} select-none`}
      onDragOver={canEdit ? (e) => {
        e.preventDefault();
        setIsDragOver(true);
      } : undefined}
      onDragLeave={canEdit ? () => setIsDragOver(false) : undefined}
      onDrop={canEdit ? (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleUpload(e.dataTransfer.files[0]);
        }
      } : undefined}
    >
      {canEdit && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      )}

      {/* Main Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
            e.currentTarget.src = fallbackSrc;
          }
        }}
        referrerPolicy="no-referrer"
      />

      {/* Drag & drop overlay - only when editing */}
      {canEdit && isDragOver && (
        <div className="absolute inset-0 z-30 bg-luxury-gold/90 text-white flex flex-col items-center justify-center p-4 text-center backdrop-blur-xs border-2 border-dashed border-white">
          <Upload className="w-8 h-8 animate-bounce mb-2" />
          <p className="font-serif text-lg font-medium">Upuść tutaj swoje oryginalne zdjęcie</p>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-90 mt-1">
            Zostanie natychmiast zapisane dla: {slotName}
          </p>
        </div>
      )}

      {/* Uploading Spinner Overlay - only when editing */}
      {canEdit && isUploading && (
        <div className="absolute inset-0 z-30 bg-white/90 text-luxury-dark flex flex-col items-center justify-center p-4 text-center backdrop-blur-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-luxury-gold mb-2" />
          <p className="font-mono text-xs uppercase tracking-wider font-bold">Zapisywanie na serwerze...</p>
          <p className="text-[10px] text-luxury-dark/70 font-light mt-0.5">100% oryginalna rozdzielczość bez modyfikacji AI</p>
        </div>
      )}

      {/* Interactive Floating Button - visible ONLY in AI Studio / dev mode */}
      {canEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className={`absolute top-3 right-3 z-20 px-2.5 py-1.5 rounded-2xs border text-[9px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-md cursor-pointer ${
            isSuccess
              ? "bg-emerald-600 text-white border-emerald-500 scale-105"
              : "bg-white/95 hover:bg-white text-luxury-dark hover:text-luxury-gold border-luxury-gold/60 hover:shadow-lg"
          }`}
          title={`Kliknij lub przeciągnij plik, aby natychmiast zamienić zdjęcie: ${slotName}`}
        >
          {isSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span className="font-bold">Zmieniono zdjęcie!</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
              <span className="font-semibold">Zmień zdjęcie</span>
            </>
          )}
        </button>
      )}

      {/* Subtle bottom tag indicating the slot - visible ONLY in AI Studio / dev mode */}
      {canEdit && (
        <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-luxury-dark/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-2xs text-[8px] font-mono tracking-wider uppercase border border-white/20 pointer-events-none">
          📷 {slotName}
        </div>
      )}

      {/* Custom Children (e.g. subtitles, gradients) */}
      {children}
    </div>
  );
};
