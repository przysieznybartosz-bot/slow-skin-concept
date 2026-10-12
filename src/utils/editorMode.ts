/**
 * Helper to determine whether photo editing mode should be active.
 * - Always active in Google AI Studio / dev environments.
 * - On LIVE / production domains (slow-skin-concept.pl, vercel.app), it can be enabled
 *   via query param (?editor=true or ?admin=true), or toggled via the footer owner control,
 *   and persists in localStorage so the owner can manage and replace photos directly on LIVE.
 */
/**
 * Helper to determine whether the app is running in Google AI Studio / development environment.
 * In production (e.g. Vercel, live domain), this returns false.
 */
export const isGoogleAIStudio = (): boolean => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname.includes("run.app") || 
    hostname.includes("localhost") || 
    hostname.includes("127.0.0.1") ||
    hostname.includes("webcontainer") ||
    hostname.includes("csb.app")
  );
};

export const isEditorMode = (): boolean => {
  if (typeof window === "undefined") return false;

  // By default, only active in Google AI Studio cloud environments and localhost
  if (isGoogleAIStudio()) return true;

  // Activation via explicit query param on live domain if needed
  const search = window.location.search.toLowerCase();
  if (search.includes("editor=true") || search.includes("google_ai=true")) {
    return true;
  }

  return false;
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
