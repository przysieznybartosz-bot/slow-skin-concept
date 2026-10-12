import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Check, Camera, Image as ImageIcon, Download, RotateCcw, AlertCircle, ChevronLeft, ChevronRight, FileArchive, Sparkles } from "lucide-react";
import JSZip from "jszip";
import { Treatment } from "../types";
import { TREATMENTS } from "../data";
import { optimizeImageForStorage, saveTreatmentCustomImage } from "../utils/imageOptimizer";

interface TreatmentCardImageModalProps {
  isOpen: boolean;
  treatment: Treatment | null;
  onClose: () => void;
  onImageSaved?: (treatmentId: string, newUrl: string) => void;
  onSelectAnotherTreatment?: (treatment: Treatment) => void;
}

export const TreatmentCardImageModal: React.FC<TreatmentCardImageModalProps> = ({
  isOpen,
  treatment,
  onClose,
  onImageSaved,
  onSelectAnotherTreatment
}) => {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever the selected treatment changes
  useEffect(() => {
    if (!treatment) return;
    setSelectedFile(null);
    setPreviewUrl(null);
    setSaveSuccess(false);
    setStatusMessage(null);

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`custom_img_${treatment.id}`);
      if (stored) {
        setCurrentImageSrc(stored);
        setIsCustom(true);
      } else {
        setCurrentImageSrc(treatment.image);
        setIsCustom(false);
      }
    } else {
      setCurrentImageSrc(treatment.image);
      setIsCustom(false);
    }
  }, [treatment]);

  if (!isOpen || !treatment) return null;

  // Find index for prev/next navigation
  const currentIndex = TREATMENTS.findIndex((t) => t.id === treatment.id);
  const prevTreatment = currentIndex > 0 ? TREATMENTS[currentIndex - 1] : null;
  const nextTreatment = currentIndex < TREATMENTS.length - 1 ? TREATMENTS[currentIndex + 1] : null;

  const handleFileChange = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Proszę wybrać poprawny plik graficzny (PNG, JPG, JPEG, WEBP).");
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSaveSuccess(false);
    setStatusMessage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSaveAndApply = async () => {
    if (!selectedFile && !previewUrl) return;
    try {
      setIsProcessing(true);
      setStatusMessage("Optymalizacja i kompresja zdjęcia...");

      // Optimize image client-side to crisp ~150-250KB WebP/JPEG
      const dataUrl = selectedFile
        ? await optimizeImageForStorage(selectedFile, 1600, 0.88)
        : previewUrl!;

      setStatusMessage("Zapisywanie w systemie i odświeżanie kart...");
      const result = await saveTreatmentCustomImage(treatment.id, dataUrl);

      setCurrentImageSrc(result.url);
      setIsCustom(true);
      setSaveSuccess(true);
      setStatusMessage("Zdjęcie zostało pomyślnie zaktualizowane!");

      if (onImageSaved) {
        onImageSaved(treatment.id, result.url);
      }

      // Cleanup preview file
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err: any) {
      console.error(err);
      alert("Błąd podczas zapisywania zdjęcia: " + (err?.message || "Nieznany błąd"));
      setStatusMessage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingleImage = async () => {
    try {
      const srcToDownload = previewUrl || currentImageSrc;
      const filename = `${treatment.id}.png`;

      // Fetch blob
      const resp = await fetch(srcToDownload);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert("Nie udało się pobrać pliku: " + err.message);
    }
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder("slow_skin_zdjecia_kart");

      let count = 0;
      for (const t of TREATMENTS) {
        const custom = localStorage.getItem(`custom_img_${t.id}`);
        const effectiveSrc = custom || t.image;
        try {
          const resp = await fetch(effectiveSrc);
          if (resp.ok) {
            const blob = await resp.blob();
            folder?.file(`${t.id}.png`, blob);
            count++;
          }
        } catch {}
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `slow-skin-zdjecia-kart-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`Pobrano paczkę ZIP zawierającą ${count} zdjęć kart zabiegowych!`);
    } catch (err: any) {
      console.error(err);
      alert("Błąd tworzenia archiwum ZIP: " + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm(`Czy na pewno chcesz przywrócić fabryczne zdjęcie dla zabiegu "${treatment.title}"?`)) {
      try {
        localStorage.removeItem(`custom_img_${treatment.id}`);
        setCurrentImageSrc(treatment.image);
        setIsCustom(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setSaveSuccess(false);

        // Notify app
        window.dispatchEvent(
          new CustomEvent("slowskin_custom_image_updated", {
            detail: { slotKey: treatment.id, url: treatment.image }
          })
        );
        if (onImageSaved) {
          onImageSaved(treatment.id, treatment.image);
        }
        setStatusMessage("Przywrócono domyślne zdjęcie.");
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-[#FAF8F5] border border-luxury-gold/60 rounded-none w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-white border-b border-luxury-sand/60 px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9.5px] uppercase tracking-widest text-luxury-gold font-bold">
                  Narzędzie Wymiany Zdjęcia Karty Zabiegowej
                </span>
                <span className="px-2 py-0.5 bg-luxury-sand/20 text-luxury-dark/80 text-[9px] font-mono border border-luxury-sand/50">
                  ID: {treatment.id}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl text-luxury-dark font-medium leading-tight mt-0.5">
                {treatment.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next navigation */}
            <div className="hidden sm:flex items-center gap-1 border border-luxury-sand/60 px-1 py-0.5 bg-[#FAF8F5]">
              <button
                type="button"
                disabled={!prevTreatment}
                onClick={() => prevTreatment && onSelectAnotherTreatment?.(prevTreatment)}
                className="p-1 hover:text-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Poprzedni zabieg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono text-luxury-dark/70 px-1">
                {currentIndex + 1} / {TREATMENTS.length}
              </span>
              <button
                type="button"
                disabled={!nextTreatment}
                onClick={() => nextTreatment && onSelectAnotherTreatment?.(nextTreatment)}
                className="p-1 hover:text-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Następny zabieg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-luxury-dark hover:text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Status Alert if save succeeded */}
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-500/40 text-emerald-900 flex items-center gap-3 animate-fadeIn">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">Sukces!</span> Zdjęcie dla zabiegu <strong>{treatment.title}</strong> zostało natychmiast zapisane i zaktualizowane na całej witrynie.
              </div>
            </div>
          )}

          {/* Main 2-Column Working Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Column 1: Current Displayed Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10.5px] uppercase tracking-wider text-luxury-dark font-semibold">
                  Aktualnie wyświetlane zdjęcie
                </label>
                <span className={`px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase border ${
                  isCustom 
                    ? "bg-amber-50 border-amber-300 text-amber-800" 
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}>
                  {isCustom ? "Twoje własne wgrane" : "Domyślne fabryczne"}
                </span>
              </div>

              {/* Photo Box with 16:10 aspect ratio */}
              <div className="aspect-[16/10] bg-luxury-sand/30 border border-luxury-sand overflow-hidden relative group">
                {(previewUrl || currentImageSrc) ? (
                  <img
                    src={previewUrl || currentImageSrc}
                    alt={treatment.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-luxury-sand/30" />
                )}
                
                {previewUrl && (
                  <div className="absolute top-2 left-2 bg-luxury-gold text-white font-mono text-[9px] px-2 py-1 uppercase tracking-wider font-bold shadow-md">
                    Nowy podgląd (niezapisany)
                  </div>
                )}
                
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white p-2 text-[10px] font-mono flex items-center justify-between">
                  <span>Plik: {treatment.id}.png</span>
                  <span>Proporcje karty: 16:10</span>
                </div>
              </div>

              {/* Reset Button */}
              {isCustom && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-[11px] font-mono text-red-700 hover:text-red-900 flex items-center gap-1.5 transition-colors pt-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Przywróć zdjęcie domyślne dla tej karty
                </button>
              )}
            </div>

            {/* Column 2: Upload Zone & Actions */}
            <div className="space-y-4">
              <label className="font-mono text-[10.5px] uppercase tracking-wider text-luxury-dark font-semibold block">
                Wgraj nowe zdjęcie dla tej karty
              </label>

              {/* Drag & Drop Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                  previewUrl 
                    ? "border-luxury-gold bg-luxury-gold/5" 
                    : "border-luxury-sand hover:border-luxury-gold bg-white hover:bg-luxury-sand/10"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />
                
                <div className="w-10 h-10 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs font-serif text-luxury-dark font-medium">
                    {selectedFile ? selectedFile.name : "Kliknij, aby wybrać zdjęcie lub przeciągnij plik tutaj"}
                  </p>
                  <p className="text-[10px] font-mono text-luxury-dark/60">
                    PNG, JPG, WEBP • Zalecana rozdzielczość: min. 1200 x 800 px
                  </p>
                </div>

                {selectedFile && (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 mt-1">
                    Rozmiar pliku: {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Save and Apply Button */}
                <button
                  type="button"
                  disabled={!selectedFile || isProcessing}
                  onClick={handleSaveAndApply}
                  className="w-full py-3 px-4 bg-luxury-dark hover:bg-luxury-gold disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {statusMessage || "Zapisywanie..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Zastosuj to zdjęcie na karcie zabiegu
                    </>
                  )}
                </button>

                {/* Download Direct File */}
                <button
                  type="button"
                  onClick={handleDownloadSingleImage}
                  className="w-full py-2.5 px-3 bg-white border border-luxury-sand hover:border-luxury-gold text-luxury-dark hover:text-luxury-gold font-mono text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Pobierz ten plik graficzny ({treatment.id}.png)
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Instructions for LIVE Domain / Vercel */}
          <div className="border border-luxury-sand/80 bg-white p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="p-1 bg-luxury-gold/15 text-luxury-gold shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="space-y-1">
                <h4 className="font-serif text-sm text-luxury-dark font-medium">
                  Jak działają zmiany zdjęć na domenie LIVE (slow-skin-concept.pl)?
                </h4>
                <p className="text-[11.5px] text-luxury-dark/80 leading-relaxed font-light">
                  1. <strong>Natychmiastowy podgląd:</strong> Po kliknięciu „Zastosuj to zdjęcie” jest ono zapisywane w pamięci podręcznej przeglądarki i natychmiast widoczne na każdej karcie zabiegu, w menu i monografii.<br />
                  2. <strong>Wdrożenie na stałe dla wszystkich gości w sieci:</strong> Hosting Vercel ładuje pliki statyczne z repozytorium. Aby Twoje zdjęcia były widoczne dla każdego nowego użytkownika bez wyjątku, pobierz plik lub paczkę ZIP i umieść plik o nazwie <code className="bg-luxury-sand/30 px-1 py-0.5 text-luxury-dark font-bold">{treatment.id}.png</code> w katalogu <code className="bg-luxury-sand/30 px-1 py-0.5 text-luxury-dark font-bold">public/</code>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-luxury-sand/40">
              <span className="text-[10px] font-mono text-luxury-dark/60">
                Pobierz wszystkie zmodyfikowane zdjęcia w jednym archiwum ZIP:
              </span>
              <button
                type="button"
                disabled={isZipping}
                onClick={handleDownloadAllZip}
                className="py-1.5 px-3 bg-luxury-sand/20 hover:bg-luxury-gold hover:text-white border border-luxury-sand hover:border-luxury-gold text-luxury-dark font-mono text-[10.5px] tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileArchive className="w-3.5 h-3.5 text-luxury-gold group-hover:text-white" />
                {isZipping ? "Tworzenie ZIP..." : "Pobierz ZIP ze wszystkimi zdjęciami"}
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-luxury-sand/60 px-5 py-3 flex items-center justify-between">
          <div className="text-[10px] font-mono text-luxury-dark/60">
            Slow Skin Concept • Zarządzanie Wizualne
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-luxury-sand/20 hover:bg-luxury-sand/50 text-luxury-dark text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Zamknij
          </button>
        </div>

      </div>
    </div>
  );
};
