import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LandscapeOrientationLock = "landscape" | "landscape-primary" | "landscape-secondary";

type OrientationApi = ScreenOrientation & {
  lock?: (orientation: LandscapeOrientationLock) => Promise<void>;
  unlock?: () => void;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function detectMobileViewport() {
  if (typeof window === "undefined") return false;

  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasNarrowViewport = window.matchMedia("(max-width: 1024px)").matches;

  return hasCoarsePointer && hasNarrowViewport;
}

function getIsLandscape() {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= window.innerHeight;
}

function getIsFullscreen() {
  if (typeof document === "undefined") return false;

  const fullscreenDocument = document as FullscreenDocument;

  return Boolean(
    fullscreenDocument.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement,
  );
}

async function requestFullscreen() {
  const fullscreenDocument = document as FullscreenDocument;
  const root = document.documentElement as FullscreenElement;

  if (getIsFullscreen()) return true;

  try {
    if (root.requestFullscreen) {
      await root.requestFullscreen({ navigationUI: "hide" });
      return true;
    }
  } catch {
    // Ignore and try vendor-prefixed fallback.
  }

  try {
    await root.webkitRequestFullscreen?.();
  } catch {
    return getIsFullscreen();
  }

  return Boolean(
    fullscreenDocument.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement,
  );
}

async function lockLandscape() {
  const orientation = window.screen.orientation as OrientationApi | undefined;

  if (!orientation?.lock) return false;

  try {
    await orientation.lock("landscape");
    return true;
  } catch {
    return false;
  }
}

export function useImmersiveMode() {
  const [isMobile, setIsMobile] = useState(detectMobileViewport);
  const [isLandscape, setIsLandscape] = useState(getIsLandscape);
  const [isFullscreen, setIsFullscreen] = useState(getIsFullscreen);
  const requestInFlightRef = useRef(false);

  const refreshState = useCallback(() => {
    setIsMobile(detectMobileViewport());
    setIsLandscape(getIsLandscape());
    setIsFullscreen(getIsFullscreen());
  }, []);

  const enableImmersiveMode = useCallback(async () => {
    if (requestInFlightRef.current || !detectMobileViewport()) return false;

    requestInFlightRef.current = true;

    try {
      const fullscreenEnabled = await requestFullscreen();
      await lockLandscape();
      refreshState();
      return fullscreenEnabled;
    } finally {
      requestInFlightRef.current = false;
    }
  }, [refreshState]);

  useEffect(() => {
    refreshState();

    const passiveOptions = { passive: true } as const;
    const maybeEnableImmersiveMode = () => {
      if (!getIsFullscreen() || !getIsLandscape()) {
        void enableImmersiveMode();
      }
    };

    window.addEventListener("resize", refreshState, passiveOptions);
    window.addEventListener("orientationchange", refreshState, passiveOptions);
    document.addEventListener("fullscreenchange", refreshState);
    document.addEventListener("webkitfullscreenchange", refreshState as EventListener);
    document.addEventListener("pointerdown", maybeEnableImmersiveMode, passiveOptions);
    document.addEventListener("touchstart", maybeEnableImmersiveMode, passiveOptions);

    return () => {
      window.removeEventListener("resize", refreshState);
      window.removeEventListener("orientationchange", refreshState);
      document.removeEventListener("fullscreenchange", refreshState);
      document.removeEventListener(
        "webkitfullscreenchange",
        refreshState as EventListener,
      );
      document.removeEventListener("pointerdown", maybeEnableImmersiveMode);
      document.removeEventListener("touchstart", maybeEnableImmersiveMode);
    };
  }, [enableImmersiveMode, refreshState]);

  const shouldShowRotateOverlay = useMemo(
    () => isMobile && !isLandscape,
    [isLandscape, isMobile],
  );

  return {
    isMobile,
    isLandscape,
    isFullscreen,
    shouldShowRotateOverlay,
    enableImmersiveMode,
  };
}
