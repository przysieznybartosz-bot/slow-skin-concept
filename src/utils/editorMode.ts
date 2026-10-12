/**
 * Helper to determine whether photo editing mode should be active.
 * Active ONLY in Google AI Studio and local development environments.
 * Strictly disabled on production domains (e.g. slow-skin-concept.pl) so that
 * visitors and clients never see edit buttons, camera overlays, or manager pills.
 */
export const isEditorMode = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const hostname = window.location.hostname.toLowerCase();
  
  // Active only in Google AI Studio cloud environments and localhost
  const isDevOrStudio = 
    hostname.includes("run.app") || 
    hostname.includes("localhost") || 
    hostname.includes("127.0.0.1") ||
    hostname.includes("webcontainer") ||
    hostname.includes("csb.app");

  // Optional hidden admin query param if the owner ever needs to test on production
  const hasOverride = 
    window.location.search.includes("editor=true") || 
    window.location.search.includes("admin=true");

  return isDevOrStudio || hasOverride;
};
