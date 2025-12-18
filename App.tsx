import React, { useMemo, useEffect } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero';
import WeddingStory from './components/WeddingStory';
import Rsvp from './components/Rsvp';
import CustomCursor from './components/CustomCursor';
import { ProgramStep } from './types';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // DATA CONFIGURATION
  
  // 1. Program Steps (Text that appears over the video)
  const programSteps: ProgramStep[] = useMemo(() => [
    {
      id: 'step1',
      time: '15:00',
      title: 'Сбор гостей',
      description: 'Встречаемся у главного входа. Легкий фуршет, шампанское и живая музыка в саду.',
      image: '/frames/5.png' // Mocking with existing frames
    },
    {
      id: 'step2',
      time: '16:00',
      title: 'Церемония',
      description: 'Самый важный момент этого дня. Обмен клятвами под открытым небом.',
      image: '/frames/15.png'
    },
    {
      id: 'step3',
      time: '17:30',
      title: 'Праздничный ужин',
      description: 'Изысканные блюда от шеф-повара, уютная атмосфера и звон бокалов.',
      image: '/frames/25.png'
    },
    {
      id: 'step4',
      time: '20:00',
      title: 'Вечеринка',
      description: 'Время сбросить каблуки. Танцы под звездами и авторские коктейли.',
      image: '/frames/45.png'
    },
    {
      id: 'step5',
      time: '22:00',
      title: 'Торт и финал',
      description: 'Сладкое завершение вечера и бенгальские огни.',
      image: '/frames/60.png'
    },
  ], []);

  return (
    <main className="no-scrollbar bg-[#FAFAFA] cursor-none">
      <CustomCursor />
      <Hero />
      <WeddingStory steps={programSteps} />
      <Rsvp />

      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </main>
  );
}

export default App;