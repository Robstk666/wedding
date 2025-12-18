import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    // Add interactions
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
        style={{
          x: springX,
          y: springY,
          scale: isHovering ? 2.5 : 1,
        }}
      />
      {/* Backdrop distortion layer behind cursor for that "interaction with background" feel */}
      <motion.div
         className="fixed top-0 left-0 w-32 h-32 rounded-full pointer-events-none z-[9998] opacity-20"
         style={{
           x: useSpring(cursorX, { ...springConfig, damping: 40 }), // slightly slower follow
           y: useSpring(cursorY, { ...springConfig, damping: 40 }),
           translateX: '-3rem', // center the bigger circle
           translateY: '-3rem',
           background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
           backdropFilter: 'blur(4px) brightness(1.2)',
         }}
      />
    </>
  );
};

export default CustomCursor;