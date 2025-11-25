/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import { useTheme } from "next-themes";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import StoryCard from "./StoryCard";

const StoriesBar = () => {
  const { theme } = useTheme();
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  const fetchStories = async () => {
    setStories(dummyStoriesData);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Detectar si se puede scrollear a izquierda y derecha
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      // Puede scrollear a la izquierda si no está al inicio
      const canLeft = container.scrollLeft > 5;
      setCanScrollLeft(canLeft);

      // Puede scrollear a la derecha si no está al final
      const canRight =
        container.scrollLeft <
        container.scrollWidth - container.clientWidth - 5;
      setCanScrollRight(canRight);
    };

    // Verificar inicialmente
    checkScroll();

    // Verificar al scrollear
    container.addEventListener("scroll", checkScroll);

    // Verificar al cambiar tamaño de ventana
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [stories]);

  // Convertir scroll vertical a horizontal
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Generar el gradiente dinámico según el estado de scroll
  const getMaskImage = () => {
    if (canScrollLeft && canScrollRight) {
      // Hay contenido a ambos lados
      return "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)";
    } else if (canScrollLeft) {
      // Solo hay contenido a la izquierda
      return "linear-gradient(to right, transparent 0%, black 20%, black 100%)";
    } else if (canScrollRight) {
      // Solo hay contenido a la derecha
      return "linear-gradient(to right, black 0%, black 80%, transparent 100%)";
    } else {
      // No hay scroll (todo el contenido visible)
      return "none";
    }
  };

  useEffect(() => {
    if (showModal || viewStory) {
      document.body.style.pointerEvents = "none";

      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.pointerEvents = "none";
      }
    } else {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.pointerEvents = "auto";
      }
    }

    return () => {
      document.body.style.pointerEvents = "unset";
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.pointerEvents = "auto";
      }
    };
  }, [showModal, viewStory]);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        maskImage: !viewStory && !showModal ? getMaskImage() : "none",
        WebkitMaskImage: !viewStory && !showModal ? getMaskImage() : "none",
        scrollBehavior: "smooth",
      }}
      className="relative mx-auto no-scrollbar overflow-x-auto"
    >
      <div className="flex gap-4 pb-5">
        <div
          onClick={() => setShowModal(true)}
          className={`rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-3/4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed bg-linear-to-b ${
            theme === "dark"
              ? "border-blue-600 from-neutral-900 to-gray-800 shadow-neutral-700"
              : "border-blue-500 from-blue-100 to-white"
          }`}
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div
              className={`size-10 rounded-full flex items-center justify-center mb-3 ${
                theme === "dark" ? "bg-blue-600 " : "bg-blue-500 "
              }`}
            >
              <Plus className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-center">Create Story</p>
          </div>
        </div>
        {stories.map((story, index) => (
          <StoryCard setViewStory={setViewStory} story={story} key={index} />
        ))}
        <div aria-hidden="true"></div>
      </div>
      {showModal && (
        <StoryModal fetchStories={fetchStories} setShowModal={setShowModal} />
      )}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};

export default StoriesBar;
