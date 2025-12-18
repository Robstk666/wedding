import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { WeddingStoryProps } from '../types';

const FRAME_COUNT = 61;
const SCROLL_HEIGHT = '500vh'; // Total scroll distance for the animation

const WeddingStory: React.FC<WeddingStoryProps> = ({ steps }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latestFrameRef = useRef(0);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Scroll Progress for the container
  // Note: containerRef must be attached to a rendered element for this to work.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress (0 to 1) to frame index (0 to 60)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Preload Images
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      try {
        const promises = [];
        for (let i = 1; i <= FRAME_COUNT; i++) {
          const img = new Image();
          img.src = `/frames/${i}.png`;
          const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
          promises.push(promise);
        }

        const loadedImages = await Promise.all(promises);

        if (isMounted) {
          setImages(loadedImages);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load frames", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadImages();
    return () => { isMounted = false; };
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions if not set (or use CSS to force fit, but internal resolution matches image)
    const img = images[Math.min(index, images.length - 1)];

    // Draw image to cover canvas (like object-fit: cover)
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Update Canvas on scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    const frame = Math.round(latest);
    setCurrentFrame(frame);
    latestFrameRef.current = frame;
    drawFrame(frame);
  });

  // Resize canvas handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawFrame(latestFrameRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  // Calculate active step
  const activeStepIndex = useMemo(() => {
     const stepDuration = FRAME_COUNT / steps.length;
     const index = Math.floor(currentFrame / stepDuration);
     return Math.min(index, steps.length - 1);
  }, [currentFrame, steps.length]);

  // ERROR STATE: Return early but warn or handle differently?
  // If we return early, ref is lost. So we must wrap everything in the container.

  return (
    <div ref={containerRef} className="relative w-full bg-[#FAFAFA]" style={{ height: error ? 'auto' : SCROLL_HEIGHT }}>

      {/* ERROR FALLBACK */}
      {error && (
        <div className="py-24 px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-12">Программа дня</h2>
            <div className="space-y-12">
                {steps.map(step => (
                    <div key={step.id} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                        <div className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-2">{step.time}</div>
                        <h3 className="text-2xl font-serif mb-4">{step.title}</h3>
                        <p className="text-stone-600 font-light">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !error && (
        <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-[#FAFAFA] font-serif text-stone-400 z-50">
            <div className="flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
               <p>Загрузка истории...</p>
            </div>
        </div>
      )}

      {/* CANVAS CONTENT */}
      {!loading && !error && (
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Overlays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
               <AnimatePresence mode="wait">
                 {steps.map((step, index) => {
                    if (index !== activeStepIndex) return null;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl max-w-lg text-center border border-white/50 pointer-events-auto"
                      >
                         <div className="inline-block mb-4 px-3 py-1 text-xs font-bold tracking-[0.2em] uppercase border border-stone-900/20 text-stone-500 rounded-full">
                            {step.time}
                         </div>
                         <h3 className="text-4xl md:text-5xl font-serif mb-6 text-stone-900">{step.title}</h3>
                         <p className="text-lg text-stone-600 font-light leading-relaxed">
                            {step.description}
                         </p>
                      </motion.div>
                    );
                 })}
               </AnimatePresence>
            </div>

            {/* Scroll Indicator */}
            {currentFrame < 5 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase animate-pulse"
                >
                    Scroll to explore
                </motion.div>
            )}
        </div>
      )}
    </div>
  );
};

export default WeddingStory;