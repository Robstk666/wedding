import React, { useEffect, useRef, useState } from 'react';
import { ProgramStep, WeddingStoryProps } from '../types';

const WeddingStory: React.FC<WeddingStoryProps> = ({ steps, frames }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // 1. Preload all images for smooth scrubbing
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      const promises = frames.map((src) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      });

      try {
        const loadedImgs = await Promise.all(promises);
        if (isMounted) {
          setImages(loadedImgs);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load frames", err);
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
      // Start slightly before 0 to catch the first frame early
      const startY = rect.top; 
      const endY = rect.bottom - viewportHeight;
      const totalDistance = rect.height - viewportHeight;

      // 0.0 to 1.0 progress within the container
      let progress = (0 - startY) / totalDistance;
      
      // Clamp progress
      progress = Math.max(0, Math.min(1, progress));

      // Calculate frame index
      const frameIndex = Math.min(
        frames.length - 1,
        Math.floor(progress * frames.length)
      );

      // Determine active text step based on progress buckets
      // e.g., if there are 5 steps, step 0 is 0-20%, step 1 is 20-40%, etc.
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
  }, [isLoading, images, frames.length, steps.length]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <p className="animate-pulse tracking-widest uppercase text-xs">Загрузка кадров...</p>
      </div>
    );
  }

  return (
    // Height determines the speed of playback. Taller = slower animation.
    // 500vh means user scrolls 5 screen heights to play the full sequence.
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
            className={`sticky top-0 h-screen flex items-center justify-center transition-all duration-700 p-6 ${
              activeStepIndex === index 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            {/* Glassmorphism Card */}
            <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-white/10 p-10 rounded-2xl text-center shadow-2xl">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest text-white uppercase bg-white/10 rounded-full border border-white/20">
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
