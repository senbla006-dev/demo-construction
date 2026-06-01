import { useEffect, useRef, useState } from "react";
import { Loader2, Film } from "lucide-react";

interface ScrollVideoBGProps {
  progress: number; // 0 to 1
}

export default function ScrollVideoBG({ progress }: ScrollVideoBGProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const lastTargetTime = useRef<number>(0);

  // Initialize and load video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 10); // fallback to 10 seconds if metadata doesn't have it
      setIsLoaded(true);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("seeked", () => setIsBuffering(false));

    // Force load the video
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  // Keep target progress in a stable ref for high-frequency updates without tearing down the RAF loop
  const progressRef = useRef(progress);
  const isSeekingEventRef = useRef(false);
  const lastSeekTimeRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Handle seeking status events to guard CPU loads without polling layout-blocking attributes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeking = () => { isSeekingEventRef.current = true; };
    const onSeeked = () => { isSeekingEventRef.current = false; };

    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  // Smooth video position interpolation loop (RAF)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded || duration === 0) return;

    let animationFrameId: number;
    let currentInterpTime = video.currentTime;

    // Detect smartphone or low performance device dynamically to adapt algorithm
    const isMobileDevice = /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) || 
                          (window.innerWidth < 768);

    const updatePlayhead = () => {
      const now = Date.now();
      const targetTime = progressRef.current * duration;

      if (isMobileDevice) {
        // Mobile-optimized scrubbing: Skip heavy frame interpolation entirely to avoid frame drop cues.
        // Directly apply the playhead position with a protective throttle of 45ms.
        const delta = Math.abs(video.currentTime - targetTime);
        if (!isSeekingEventRef.current && delta > 0.02 && (now - lastSeekTimeRef.current > 45)) {
          const boundedTime = Math.max(0.005, Math.min(duration - 0.05, targetTime));
          video.currentTime = boundedTime;
          lastSeekTimeRef.current = now;
        }
      } else {
        // Desktop-premium: Smoothly slide current playhead towards target time (LERP)
        const distance = Math.abs(targetTime - currentInterpTime);
        
        // Dynamic speed based on distance
        const lerpSpeed = Math.min(0.40, 0.12 + distance * 0.25);
        currentInterpTime += (targetTime - currentInterpTime) * lerpSpeed;

        if (distance < 0.005) {
          currentInterpTime = targetTime;
        }

        // Apply seek to HTML5 video block only if ready, minimizing excessive keyframe loads
        const timeDiff = Math.abs(video.currentTime - currentInterpTime);
        if (!isSeekingEventRef.current && timeDiff > 0.015 && (now - lastSeekTimeRef.current > 24)) {
          const boundedTime = Math.max(0.005, Math.min(duration - 0.05, currentInterpTime));
          video.currentTime = boundedTime;
          lastSeekTimeRef.current = now;
        }
      }

      animationFrameId = requestAnimationFrame(updatePlayhead);
    };

    animationFrameId = requestAnimationFrame(updatePlayhead);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, duration]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-[#050A14] z-0 video-bg-container">
      
      {/* Core scrubbing HTML5 Video with SpaceX/Tesla grade filters and properties */}
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 w-full h-full object-cover opacity-100 will-change-transform transform-gpu"
        muted
        playsInline
        preload="auto"
        loop
        poster="/src/assets/images/structural_steel_1780318362692.png"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <source src="https://cdn.jsdelivr.net/gh/senbla006-dev/video@main/7ac9be2d-6002-48ad-8616-9f68b0ad30a3.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Synchronization Status Indicators - minimized to ensure zero video interference */}
      {(!isLoaded || isBuffering) && (
        <div className="absolute top-8 right-8 z-50 flex items-center gap-3 bg-black/75 px-5 py-2.5 rounded-full border border-white/20 text-xs font-mono backdrop-blur-md animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          <span className="text-white tracking-wider">
            {!isLoaded ? "SYNCING TIMELINE..." : "BUFFERING..."}
          </span>
        </div>
      )}
    </div>
  );
}
