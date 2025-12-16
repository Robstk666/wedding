import React from 'react';

const Rsvp: React.FC = () => {
  return (
    <section className="bg-[#FAFAFA] py-24 px-6 relative z-30 -mt-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 text-[#1D1D1F] font-serif">Будем вас ждать</h2>
        <p className="text-stone-500 mb-12 text-lg">
          Пожалуйста, подтвердите своё присутствие до 1 сентября.
        </p>

        <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Ваше имя</label>
            <input 
              type="text" 
              id="name"
              className="w-full px-4 py-4 rounded-xl bg-stone-50 border-0 focus:bg-white focus:ring-1 focus:ring-stone-300 outline-none transition-all duration-300 text-lg placeholder-stone-400"
              placeholder="Иван и Мария"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="relative">
              <label htmlFor="guests" className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Гостей</label>
              <select id="guests" className="w-full px-4 py-4 rounded-xl bg-stone-50 border-0 focus:bg-white focus:ring-1 focus:ring-stone-300 outline-none transition-all duration-300 text-lg appearance-none text-[#1D1D1F]">
                <option>Я приду один/одна</option>
                <option>Нас будет двое</option>
                <option>К сожалению, не смогу</option>
              </select>
            </div>
            <div>
              <label htmlFor="food" className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Предпочтения по еде</label>
              <input 
                type="text" 
                id="food"
                className="w-full px-4 py-4 rounded-xl bg-stone-50 border-0 focus:bg-white focus:ring-1 focus:ring-stone-300 outline-none transition-all duration-300 text-lg placeholder-stone-400"
                placeholder="Аллергии, веган..."
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1D1D1F] text-white font-medium text-lg py-5 rounded-xl hover:bg-stone-800 transition-all duration-300 mt-8 hover:scale-[1.02] active:scale-[0.98]"
          >
            Подтвердить участие
          </button>
        </form>

        <footer className="mt-24 text-stone-400 text-sm">
          <p>© 2024 Анна & Сергей. Сделано с любовью.</p>
        </footer>
      </div>
    </section>
  );
};

export default Rsvp;