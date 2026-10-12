/**
 * Helper to determine whether the app is running in Google AI Studio / development environment.
 * In production (e.g. Vercel, live domain), this returns false.
 */
export const isGoogleAIStudio = (): boolean => {
  // If compiled in production mode (e.g. Vercel deployment), NEVER show AI Studio editor buttons!
  if (import.meta.env.PROD) {
    return false;
  }

  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname.toLowerCase();

  // Explicitly deny live production domains
  if (
    hostname.includes("slow-skin-concept.pl") ||
    hostname.includes("slowskinconcept.pl") ||
    hostname.includes("vercel.app")
  ) {
    return false;
  }

  return (
    hostname.includes("run.app") || 
    hostname.includes("localhost") || 
    hostname.includes("127.0.0.1") ||
    hostname.includes("webcontainer") ||
    hostname.includes("csb.app") ||
    hostname.includes("googleusercontent.com")
  );
};

export const isEditorMode = (): boolean => {
  if (typeof window === "undefined") return false;
  // Strictly available only in Google AI Studio / development preview
  return isGoogleAIStudio();
};

export const setEditorMode = (active: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("slowskin_editor_active", active ? "true" : "false");
    window.dispatchEvent(new CustomEvent("slowskin_editor_mode_change", { detail: { active } }));
  } catch {}
};

export const toggleEditorMode = (): boolean => {
  const current = isEditorMode();
  const next = !current;
  setEditorMode(next);
  return next;
};

