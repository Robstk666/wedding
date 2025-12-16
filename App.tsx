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
  // ИНСТРУКЦИЯ:
  // Для корректной работы в большинстве React-проектов (Vite, CRA):
  // 1. Создайте папку "frames" внутри папки "public". 
  //    (Итоговый путь: project_root/public/frames/1.png ...)
  // 2. Если папки "public" нет, создайте папку "frames" в корне проекта.
  const frames = useMemo(() => {
    const frameCount = 61; // Количество кадров
    
    return Array.from({ length: frameCount }, (_, i) => {
      // Путь начинается с /frames, что указывает на корень домена (обычно public folder)
      return `/frames/${i + 1}.png`; 
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