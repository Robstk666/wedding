import React, { useEffect, useRef, useState } from 'react';
import { ProgramStep, WeddingStoryProps } from '../types';

const WeddingStory: React.FC<WeddingStoryProps> = ({ steps, frames }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // 1. Preload all images for smooth scrubbing
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      setIsLoading(true);
      setError(null);
      
      // Load all images, resolving to null if they fail
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

        // Filter out failed images
        const successfulImages = loadedResults.filter((img): img is HTMLImageElement => img !== null);

        if (successfulImages.length === 0) {
          setError("Не удалось загрузить кадры. Проверьте путь к файлам.");
          setIsLoading(false);
          return;
        }

        // If we have at least one image, we can proceed
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

      // Handle "object-fit: cover" logic for canvas
      const w = canvas.width;
      const h = canvas.height;
      const iw = img.width;
      const ih = img.height;
      const r = Math.min(w / iw, h / ih);
      let nw = iw * r;
      let nh = ih * r;
      let ar = 1;

      // Decide which gap to fill to cover the area
      if (nw < w) ar = w / nw;
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
      nw *= ar;
      nh *= ar;

      // Center the image
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
      
      // Calculate how far we've scrolled into the container
      const startY = rect.top; 
      const totalDistance = rect.height - viewportHeight;

      // 0.0 to 1.0 progress within the container
      let progress = (0 - startY) / totalDistance;
      
      // Clamp progress
      progress = Math.max(0, Math.min(1, progress));

      // Calculate frame index based on AVAILABLE images
      const totalFrames = images.length;
      if (totalFrames === 0) return;

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(progress * totalFrames)
      );

      // Determine active text step
      const stepIndex = Math.min(
        steps.length - 1,
        Math.floor(progress * steps.length)
      );
      
      setActiveStepIndex(stepIndex);

      // Render using RequestAnimationFrame for performance
      requestAnimationFrame(() => renderFrame(frameIndex));
    };

    // Initial render
    renderFrame(0);

    // Initial resize to fill screen
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-render current frame after resize
        handleScroll(); 
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); // trigger once

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
           <p className="text-stone-600 text-xs mt-4">
             Проверьте консоль браузера для деталей (F12). <br/>
             Убедитесь, что файлы 1.png...61.png доступны.
           </p>
        </div>
      </div>
    );
  }

  return (
    // Height determines the speed of playback. Taller = slower animation.
    <div ref={containerRef} className="relative w-full h-[500vh] bg-black">
      
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full"
        />
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      {/* Floating Text Steps */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`sticky top-0 h-screen flex items-center justify-center transition-all duration-1000 p-6 ${
              activeStepIndex === index 
                ? 'opacity-100 translate-y-0 scale-100 blur-none'
                : 'opacity-0 translate-y-12 scale-90 blur-sm'
            }`}
          >
            {/* Glassmorphism Card */}
            <div className="max-w-md w-full bg-black/30 backdrop-blur-xl border border-white/10 p-12 rounded-3xl text-center shadow-2xl transition-transform duration-500">
              <span className="inline-block px-3 py-1 mb-6 text-[10px] font-semibold tracking-[0.2em] text-white uppercase bg-white/10 rounded-full border border-white/10">
                {step.time}
              </span>
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">
                {step.title}
              </h3>
              <p className="text-base text-stone-200 leading-relaxed font-light">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingStory;