import React, { useMemo } from 'react';
import Hero from './components/Hero';
import WeddingStory from './components/WeddingStory';
import Rsvp from './components/Rsvp';
import { ProgramStep } from './types';

function App() {
  // DATA CONFIGURATION
  
  // 1. Program Steps (Text that appears over the video)
  const programSteps: ProgramStep[] = useMemo(() => [
    {
      id: 'step1',
      time: '15:00',
      title: 'Сбор гостей',
      description: 'Встречаемся у главного входа. Легкий фуршет, шампанское и живая музыка в саду.',
    },
    {
      id: 'step2',
      time: '16:00',
      title: 'Церемония',
      description: 'Самый важный момент этого дня. Обмен клятвами под открытым небом.',
    },
    {
      id: 'step3',
      time: '17:30',
      title: 'Праздничный ужин',
      description: 'Изысканные блюда от шеф-повара, уютная атмосфера и звон бокалов.',
    },
    {
      id: 'step4',
      time: '20:00',
      title: 'Вечеринка',
      description: 'Время сбросить каблуки. Танцы под звездами и авторские коктейли.',
    },
    {
      id: 'step5',
      time: '22:00',
      title: 'Торт и финал',
      description: 'Сладкое завершение вечера и бенгальские огни.',
    },
  ], []);

  // 2. Frame Sequence Generation
  // In a real scenario, you would list your files here:
  // const frames = ['/img/frame_001.jpg', '/img/frame_002.jpg', ...];
  // Below we simulate 100 frames by repeating 5 placeholder images.
  const frames = useMemo(() => {
    const frameCount = 100; // How many frames you have
    const baseImages = [
      'https://picsum.photos/id/433/1920/1080', // Garden/Gathering
      'https://picsum.photos/id/314/1920/1080', // Ceremony/Flowers
      'https://picsum.photos/id/250/1920/1080', // Camera/Details
      'https://picsum.photos/id/453/1920/1080', // Party/Music
      'https://picsum.photos/id/292/1920/1080', // Food/Cake
    ];

    return Array.from({ length: frameCount }, (_, i) => {
      // Logic to switch image every 20 frames to simulate a sequence
      const imageIndex = Math.floor(i / (frameCount / baseImages.length));
      return baseImages[Math.min(imageIndex, baseImages.length - 1)];
    });
  }, []);

  return (
    <main className="no-scrollbar bg-[#FAFAFA]">
      <Hero />
      <WeddingStory steps={programSteps} frames={frames} />
      <Rsvp />
    </main>
  );
}

export default App;
