
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Star, MapPin, PlusCircle, ArrowUpRight, Sparkles, ChevronRight } from 'lucide-react';
import { PUNE_SPOTS } from '../constants';

const PlanView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto pb-24 bg-white min-h-full">
      <header className="space-y-3">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Explore Pune</h2>
        <p className="text-slate-500 text-base font-medium">Find hidden gems and optimize your travel route.</p>
      </header>

      <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
        {['All', 'Heritage', 'Nature', 'Religious', 'Shopping', 'Parks'].map((cat) => (
          <button 
            key={cat}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
              cat === 'All' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-600' 
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="space-y-6">
        {PUNE_SPOTS.map((spot) => (
          <div key={spot.name} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 group transition-all hover:shadow-2xl">
            <div className="h-56 bg-slate-100 relative">
              <img 
                src={spot.imageUrl} 
                alt={spot.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                {spot.category}
              </div>
              <button className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors">
                <PlusCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-xl text-slate-800 tracking-tight">{spot.name}</h3>
                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black ml-1">4.8</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{spot.description}</p>
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-indigo-700">
                  <MapPin size={18} />
                  <span className="text-[11px] font-black truncate max-w-[200px] uppercase tracking-wide">{spot.bestRoute}</span>
                </div>
                <button className="bg-white text-indigo-600 p-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="bg-indigo-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10 group cursor-pointer"
           onClick={() => navigate('/chat?mode=agent')}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-3 text-indigo-400 group-hover:scale-110 transition-transform origin-left">
            <Sparkles size={28} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">AI Travel Hub</span>
          </div>
          <h3 className="text-3xl font-black tracking-tight">Custom Trip Maker</h3>
          <p className="text-indigo-200 text-sm font-medium leading-relaxed max-w-xs">Let our smart agent plan your entire stay in Pune with detailed budgeting.</p>
          <button className="bg-white text-slate-900 w-full py-4 rounded-2xl font-black text-base shadow-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-3 active:scale-95">
            <span>GENERATE MY PLAN</span>
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-20 blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default PlanView;
