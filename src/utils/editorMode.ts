/**
 * Helper to determine whether photo editing mode should be active.
 * - Always active in Google AI Studio / dev environments.
 * - On LIVE / production domains (slow-skin-concept.pl, vercel.app), it can be enabled
 *   via query param (?editor=true or ?admin=true), or toggled via the footer owner control,
 *   and persists in localStorage so the owner can manage and replace photos directly on LIVE.
 */
export const isEditorMode = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const saved = localStorage.getItem("slowskin_editor_active");
    if (saved === "true") return true;
    if (saved === "false") return false;
  } catch {}

  const hostname = window.location.hostname.toLowerCase();
  
  // Active by default in Google AI Studio cloud environments and localhost
  const isDevOrStudio = 
    hostname.includes("run.app") || 
    hostname.includes("localhost") || 
    hostname.includes("127.0.0.1") ||
    hostname.includes("webcontainer") ||
    hostname.includes("csb.app");

  if (isDevOrStudio) return true;

  // Activation via query param on live domain (e.g. slow-skin-concept.pl/?admin=true)
  const search = window.location.search.toLowerCase();
  if (search.includes("editor=true") || search.includes("admin=true")) {
    try {
      localStorage.setItem("slowskin_editor_active", "true");
    } catch {}
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
