import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgramStep, WeddingStoryProps } from '../types';

const WeddingStory: React.FC<WeddingStoryProps> = ({ steps, frames }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // 1. Preload all images
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      setIsLoading(true);
      setError(null);
      
      const promises = frames.map((src) => {
        return new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.warn(`Failed to load frame: ${src}`);
            resolve(null);
          };
        });
      });

      try {
        const loadedResults = await Promise.all(promises);
        
        if (!isMounted) return;

        const successfulImages = loadedResults.filter((img): img is HTMLImageElement => img !== null);

        if (successfulImages.length === 0) {
          setError("Не удалось загрузить кадры. Проверьте путь к файлам.");
          setIsLoading(false);
          return;
        }

        setImages(successfulImages);
        setIsLoading(false);
      } catch (err) {
        console.error("Critical error loading frames", err);
        if (isMounted) {
            setError("Ошибка при загрузке изображений.");
            setIsLoading(false);
        }
      }
    };

    loadImages();
    return () => { isMounted = false; };
  }, [frames]);

  // 2. Draw the correct frame based on scroll position
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = images[index];

      if (!canvas || !ctx || !img) return;

      const w = canvas.width;
      const h = canvas.height;
      const iw = img.width;
      const ih = img.height;
      const r = Math.min(w / iw, h / ih);
      let nw = iw * r;
      let nh = ih * r;
      let ar = 1;

      if (nw < w) ar = w / nw;
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
      nw *= ar;
      nh *= ar;

      const x = (w - nw) / 2;
      const y = (h - nh) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, x, y, nw, nh);
    };

    const handleScroll = () => {
      if (!containerRef.current || !canvasRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const startY = rect.top; 
      const totalDistance = rect.height - viewportHeight;

      let progress = (0 - startY) / totalDistance;
      progress = Math.max(0, Math.min(1, progress));

      const totalFrames = images.length;
      if (totalFrames === 0) return;

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(progress * totalFrames)
      );

      // Determine active text step with a bit more buffer at the start/end
      const stepIndex = Math.min(
        steps.length - 1,
        Math.floor(progress * steps.length)
      );
      
      setActiveStepIndex(stepIndex);

      requestAnimationFrame(() => renderFrame(frameIndex));
    };

    renderFrame(0);

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        handleScroll(); 
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoading, images, steps.length]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <p className="animate-pulse tracking-widest uppercase text-xs">Загрузка кадров...</p>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white px-6 text-center">
        <div>
           <p className="text-red-400 mb-2 font-medium">Что-то пошло не так</p>
           <p className="text-stone-400 text-sm max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-black">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {steps.map((step, index) => {
          const isActive = activeStepIndex === index;
          return (
            <div
              key={step.id}
              className="sticky top-0 h-screen flex items-center justify-center p-6 overflow-hidden"
            >
              <AnimatePresence mode='wait'>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple-like ease
                    className="max-w-md w-full bg-black/40 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl text-center shadow-2xl"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="inline-block px-3 py-1 mb-6 text-[10px] font-semibold tracking-[0.2em] text-white uppercase bg-white/10 rounded-full border border-white/10"
                    >
                      {step.time}
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-tight"
                    >
                      {step.title}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-lg text-stone-200 leading-relaxed font-light"
                    >
                      {step.description}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeddingStory;