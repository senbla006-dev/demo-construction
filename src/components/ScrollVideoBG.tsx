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
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Smooth video position interpolation loop (RAF)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded || duration === 0) return;

    let animationFrameId: number;
    let currentInterpTime = video.currentTime;

    const updatePlayhead = () => {
      // Map current progress target
      const targetTime = progressRef.current * duration;

      // Distance remaining to target playhead
      const distance = Math.abs(targetTime - currentInterpTime);

      // Accelerate the scroll reaction dynamically if scrolling quickly to avoid lag
      const lerpSpeed = Math.min(0.35, 0.10 + distance * 0.2); 
      currentInterpTime += (targetTime - currentInterpTime) * lerpSpeed;

      // Ensure stable snapping to prevent microscopic floating updates
      if (distance < 0.005) {
        currentInterpTime = targetTime;
      }

      // Seek immediately if not currently in a seeking operation and delta is meaningful
      if (!video.seeking && Math.abs(video.currentTime - currentInterpTime) > 0.01) {
        const boundedTime = Math.max(0.005, Math.min(duration - 0.05, currentInterpTime));
        video.currentTime = boundedTime;
      }

      animationFrameId = requestAnimationFrame(updatePlayhead);
    };

    animationFrameId = requestAnimationFrame(updatePlayhead);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, duration]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-transparent z-0">
      
      {/* Core scrubbing HTML5 Video - Fully colored & 100/100 visible with no filters or masks */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-100 will-change-transform transform-gpu"
        src="https://cdn.jsdelivr.net/gh/senbla006-dev/video@main/a437adcf-91e0-40d8-a45c-c92bc1aadfa7.mp4"
        muted
        playsInline
        preload="auto"
        loop
        style={{ transform: "translate3d(0,0,0)" }}
      />

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
