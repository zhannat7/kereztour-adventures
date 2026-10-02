import { useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const VIDEO_ID = "YBRknUnMIE0";
const RESUME_STORAGE_KEY = "kereztour-nomad-games-resume";
const SAVE_INTERVAL_MS = 5000;

type YouTubePlayer = {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
};

type YouTubePlayerOptions = {
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
    // The YouTube iframe can be temporarily unavailable while buffering/reloading.
  }
};

const NomadGames = () => {
  const ref = useScrollReveal();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const saveTimerRef = useRef<number | null>(null);
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

    const connectApiToExistingIframe = async () => {
      try {
        await loadYouTubeApi();

        if (cancelled || !iframeRef.current || !window.YT?.Player) return;

        const player = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: ({ target }) => {
              const savedPosition = getSavedPosition();

              try {
                if (savedPosition > 0) {
                  target.seekTo(savedPosition, true);
                }
              } catch {
                // Resume is best-effort; the native YouTube player remains available.
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
              // Important: do not destroy or replace the iframe.
              // The native YouTube player remains visible and the homepage stays intact.
            },
          },
        });

        playerRef.current = player;
      } catch (error) {
        console.error("Nomad Games API enhancement unavailable:", error);
        // The already-rendered native iframe continues working without the API.
      }
    };

    void connectApiToExistingIframe();

    const saveBeforePageHide = () => savePosition(playerRef.current);
    window.addEventListener("pagehide", saveBeforePageHide);

    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", saveBeforePageHide);
      stopSaving();
      savePosition(playerRef.current);
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
            <iframe
              ref={iframeRef}
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&start=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
              title="Welt der Nomaden 2026 – Kirgisistan in Bewegung"
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
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

export default NomadGames;
