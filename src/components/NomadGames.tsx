import { Component, type ErrorInfo, type ReactNode, useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const VIDEO_ID = "YBRknUnMIE0";
const RESUME_STORAGE_KEY = "kereztour-nomad-games-resume";
const SAVE_INTERVAL_MS = 5000;

type YouTubePlayer = {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
};

type YouTubePlayerOptions = {
  videoId: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
    onError?: (event: { data: number; target: YouTubePlayer }) => void;
  };
};

type YouTubePlayerConstructor = new (
  element: HTMLElement,
  options: YouTubePlayerOptions,
) => YouTubePlayer;

declare global {
  interface Window {
    YT?: {
      Player: YouTubePlayerConstructor;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

const loadYouTubeApi = (): Promise<void> => {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    const timeoutId = window.setTimeout(() => {
      youtubeApiPromise = null;
      reject(new Error("YouTube IFrame API timeout"));
    }, 15000);

    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeoutId);
      previousReady?.();
      resolve();
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existingScript) {
      if (window.YT?.Player) {
        window.clearTimeout(timeoutId);
        resolve();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timeoutId);
      youtubeApiPromise = null;
      reject(new Error("YouTube IFrame API failed to load"));
    };
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
};

const getSavedPosition = (): number => {
  try {
    const saved = Number(window.localStorage.getItem(RESUME_STORAGE_KEY) ?? 0);
    return Number.isFinite(saved) && saved > 5 ? saved : 0;
  } catch {
    return 0;
  }
};

const savePosition = (player: YouTubePlayer | null) => {
  if (!player) return;

  try {
    const position = player.getCurrentTime();
    if (Number.isFinite(position) && position > 0) {
      window.localStorage.setItem(RESUME_STORAGE_KEY, String(Math.floor(position)));
    }
  } catch {
    // The YouTube iframe may be temporarily unavailable while buffering/reloading.
  }
};

class NomadGamesErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Nomad Games video component error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

const NomadGamesContent = () => {
  const ref = useScrollReveal();
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const recoveryAttemptsRef = useRef(0);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const stopSaving = () => {
      if (saveTimerRef.current !== null) {
        window.clearInterval(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };

    const startSaving = (player: YouTubePlayer) => {
      stopSaving();
      saveTimerRef.current = window.setInterval(() => {
        savePosition(player);
      }, SAVE_INTERVAL_MS);
    };

    const createPlayer = async () => {
      try {
        await loadYouTubeApi();

        if (cancelled || !playerContainerRef.current || !window.YT?.Player) return;

        const player = new window.YT.Player(playerContainerRef.current, {
          videoId: VIDEO_ID,
          playerVars: {
            rel: 0,
            playsinline: 1,
            start: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              const savedPosition = getSavedPosition();

              try {
                if (savedPosition > 0) {
                  target.seekTo(savedPosition, true);
                }
              } catch {
                // Ignore a transient seek failure; playback can continue normally.
              }

              playerRef.current = target;
            },
            onStateChange: ({ data, target }) => {
              try {
                if (!window.YT) return;

                if (data === window.YT.PlayerState.PLAYING) {
                  playerRef.current = target;
                  startSaving(target);
                }

                if (data === window.YT.PlayerState.PAUSED) {
                  savePosition(target);
                  stopSaving();
                }

                if (data === window.YT.PlayerState.BUFFERING) {
                  savePosition(target);
                }

                if (data === window.YT.PlayerState.ENDED) {
                  stopSaving();
                  try {
                    window.localStorage.removeItem(RESUME_STORAGE_KEY);
                  } catch {
                    // Ignore storage restrictions.
                  }
                }
              } catch (error) {
                console.error("Nomad Games player state error:", error);
              }
            },
            onError: ({ data, target }) => {
              savePosition(target);
              stopSaving();

              console.error("Nomad Games YouTube player error:", data);

              if (cancelled || recoveryAttemptsRef.current >= 2) return;

              recoveryAttemptsRef.current += 1;
              window.setTimeout(() => {
                if (cancelled || !playerContainerRef.current) return;

                try {
                  target.destroy();
                } catch {
                  // Ignore cleanup errors from an already failed iframe.
                }

                playerRef.current = null;
                void createPlayer();
              }, 1500);
            },
          },
        });

        playerRef.current = player;
      } catch (error) {
        console.error("Nomad Games YouTube initialization error:", error);
      }
    };

    void createPlayer();

    const saveBeforePageHide = () => savePosition(playerRef.current);
    window.addEventListener("pagehide", saveBeforePageHide);

    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", saveBeforePageHide);
      stopSaving();
      savePosition(playerRef.current);

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore cleanup errors when the iframe is already gone.
        }
      }

      playerRef.current = null;
    };
  }, []);

  return (
    <section className="bg-background py-14 md:py-20">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="eyebrow mb-5 justify-center before:hidden">{t("Welt der Nomaden 2026")}</span>
          <h2 className="mb-5 font-display text-4xl leading-tight text-foreground md:text-6xl">
            {t("Kirgisistan")} <span className="italic text-primary">{t("in Bewegung")}</span>
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-[900px] overflow-hidden border border-border shadow-lift">
          <div className="relative w-full aspect-video">
            <div
              ref={playerContainerRef}
              className="absolute inset-0 h-full w-full"
              aria-label="Welt der Nomaden 2026 – Kirgisistan in Bewegung"
            />
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-[900px] text-right text-xs text-muted-foreground">
          Video: AKIpress News · YouTube
        </p>
      </div>
    </section>
  );
};

const NomadGames = () => (
  <NomadGamesErrorBoundary>
    <NomadGamesContent />
  </NomadGamesErrorBoundary>
);

export default NomadGames;
