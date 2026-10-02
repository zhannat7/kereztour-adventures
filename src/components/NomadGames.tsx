import { useEffect, useRef } from "react";
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

  youtubeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
};

const getSavedPosition = (): number => {
  const saved = Number(window.localStorage.getItem(RESUME_STORAGE_KEY) ?? 0);
  return Number.isFinite(saved) && saved > 5 ? saved : 0;
};

const savePosition = (player: YouTubePlayer) => {
  const position = player.getCurrentTime();
  if (Number.isFinite(position) && position > 0) {
    window.localStorage.setItem(RESUME_STORAGE_KEY, String(Math.floor(position)));
  }
};

const NomadGames = () => {
  const ref = useScrollReveal();
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
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

    const createPlayer = async () => {
      await loadYouTubeApi();

      if (cancelled || !playerContainerRef.current || !window.YT?.Player) return;

      const player = new window.YT.Player(playerContainerRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          rel: 0,
          playsinline: 1,
          start: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: ({ target }) => {
            const savedPosition = getSavedPosition();

            if (savedPosition > 0) {
              target.seekTo(savedPosition, true);
            }

            playerRef.current = target;
          },
          onStateChange: ({ data, target }) => {
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
              window.localStorage.removeItem(RESUME_STORAGE_KEY);
            }
          },
        },
      });

      playerRef.current = player;
    };

    void createPlayer();

    return () => {
      cancelled = true;
      if (playerRef.current) {
        savePosition(playerRef.current);
        playerRef.current.destroy();
      }
      playerRef.current = null;
      stopSaving();
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

export default NomadGames;
