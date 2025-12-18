import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] overflow-hidden">
      <div className="z-10 text-center px-4 animate-fade-in-up">
        <p className="text-sm md:text-base tracking-[0.2em] text-stone-500 uppercase mb-6">
          Приглашение
        </p>
        <h1 className="text-6xl md:text-9xl font-serif text-[#1D1D1F] mb-6 leading-tight tracking-tight">
          Анна <span className="font-light italic text-stone-400">&</span> Сергей
        </h1>
        <div className="h-px w-24 bg-stone-300 mx-auto my-8"></div>
        <p className="text-xl md:text-2xl font-light text-stone-600 mb-2">
          25 Сентября 2024
        </p>
        <p className="text-stone-500">Санкт-Петербург, Villa d'Este</p>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-float">
        <p className="text-xs text-stone-400 mb-2 uppercase tracking-widest">Программа</p>
        <ArrowDown className="text-stone-400 w-5 h-5" />
      </div>
    </section>
  );
};

export default Hero;