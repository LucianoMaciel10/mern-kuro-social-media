/* eslint-disable react-hooks/exhaustive-deps */
import { BadgeCheck, Pause, X, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const elapsedTimeRef = useRef(0); // Tiempo transcurrido real
  const lastTimeRef = useRef(null); // Último timestamp
  const navigate = useNavigate();

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    // Desactivar scroll del body
    document.body.style.overflow = "hidden";

    // Limpiar al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        togglePause();
      }
      if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused, isMuted]);

  // Controlar pause/play del video
  useEffect(() => {
    if (viewStory?.media_type === "video" && videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPaused, viewStory]);

  // Controlar mute/unmute del video
  useEffect(() => {
    if (viewStory?.media_type === "video" && videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, viewStory]);

  // Progress bar para imágenes y texto
  useEffect(() => {
    if (!viewStory || viewStory.media_type === "video") return;

    const duration = 10000; // 10 segundos

    const updateProgress = (currentTime) => {
      if (!isPaused) {
        if (lastTimeRef.current !== null) {
          // Sumar solo el tiempo que pasó desde el último frame
          const delta = currentTime - lastTimeRef.current;
          elapsedTimeRef.current += delta;
        }
        lastTimeRef.current = currentTime;

        const newProgress = (elapsedTimeRef.current / duration) * 100;
        setProgress(Math.min(newProgress, 100));

        if (elapsedTimeRef.current >= duration) {
          setViewStory(false);
          return;
        }
      } else {
        // Cuando está pausado, resetear lastTime para no contar este tiempo
        lastTimeRef.current = null;
      }

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewStory, isPaused, setViewStory]);

  // Progress bar para videos
  useEffect(() => {
    if (!viewStory || viewStory.media_type !== "video" || !videoRef.current)
      return;

    const video = videoRef.current;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [viewStory]);

  // Reset al cambiar story
  useEffect(() => {
    setProgress(0);
    elapsedTimeRef.current = 0;
    lastTimeRef.current = null;
    setIsPaused(false);
    setIsMuted(false);
  }, [viewStory]);

  if (!viewStory) return null;

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return <img src={viewStory.media_url} alt="Story" />;
      case "video":
        return (
          <video
            ref={videoRef}
            autoPlay
            className="-z-10"
            onEnded={() => setViewStory(false)}
            src={viewStory.media_url}
          ></video>
        );
      case "text":
        return (
          <div className="flex items-center justify-center p-12 text-white text-2xl text-center">
            {viewStory.content}
          </div>
        );
      default:
        return null;
    }
  };

  return createPortal(
    <div
      style={{ pointerEvents: "auto" }}
      className="fixed inset-0 backdrop-blur bg-black/80 z-100"
      onClick={() => setViewStory(false)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          togglePause();
        }}
        className="shadow-2xl fixed rounded-lg overflow-hidden w-full h-full inset-0 bg-opacity-90 z-110 flex items-center justify-center cursor-pointer sm:m-auto sm:h-[90vh] sm:w-140"
        style={{
          backgroundColor:
            viewStory.media_type === "text"
              ? viewStory.background_color
              : "#0e0e0e",
        }}
      >
        {/* Barra de progreso */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-blue-400"
          ></div>
        </div>

        {/* Header usuario */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`cursor-auto absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-3 sm:px-8 backdrop-blur-2xl rounded-lg ${
            viewStory.media_type === "video" || viewStory.media_type === "image"
              ? "bg-white/10"
              : "bg-black/10"
          }`}
        >
          <img
            onClick={() => navigate(`/profile/${viewStory.user._id}`)}
            src={viewStory.user?.profile_picture}
            alt={viewStory.user?.full_name}
            className="cursor-pointer size-7 sm:size-8 rounded-full object-cover border border-white"
          />
          <div className="relative text-white font-medium flex items-center gap-1.5">
            <span
              className="cursor-pointer"
              onClick={() => navigate(`/profile/${viewStory.user._id}`)}
            >
              {viewStory.user?.full_name}
            </span>
            <BadgeCheck size={18} />
            {/* Indicador de pausa */}
            {isPaused && (
              <div className="absolute -right-20 opacity-80 text-6xl pointer-events-none">
                <Pause size={35} fill="white" color="none" />
              </div>
            )}
          </div>
        </div>

        {/* Botón Mute/Unmute - SOLO PARA VIDEOS */}
        {viewStory.media_type === "video" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="absolute cursor-pointer bottom-4 right-4 p-3 backdrop-blur-xl rounded-full bg-black/30 hover:bg-black/50 transition-colors z-50"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        )}

        {/* Botón cerrar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewStory(false);
          }}
          className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none z-50"
        >
          <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
        </button>

        {/* Contenido */}
        {renderContent()}
      </div>
    </div>,
    document.body
  );
};

export default StoryViewer;
