
import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Bus, 
  Train, 
  Car, 
  TrendingUp, 
  BarChart3, 
  Map, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  MapPin, 
  ChevronRight,
  PieChart
} from 'lucide-react';
import { TravelHistoryItem, TransportMode } from '../types';

const HistoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'insights'>('insights');

  const history: TravelHistoryItem[] = [
    { id: '1', date: 'Today, 10:15 AM', from: 'Vanaz', to: 'Civil Court', mode: TransportMode.METRO, cost: 20 },
    { id: '2', date: 'Yesterday, 06:30 PM', from: 'Hadapsar', to: 'Swargate', mode: TransportMode.BUS, cost: 15 },
    { id: '3', date: 'Yesterday, 09:12 AM', from: 'Kothrud', to: 'Viman Nagar', mode: TransportMode.CAB, cost: 320 },
    { id: '4', date: '21 Oct, 11:45 AM', from: 'Shivaji Nagar', to: 'Pimpri', mode: TransportMode.METRO, cost: 25 },
    { id: '5', date: '20 Oct, 08:20 PM', from: 'Pune Station', to: 'Swargate', mode: TransportMode.BUS, cost: 10 },
    { id: '6', date: '18 Oct, 04:10 PM', from: 'Baner', to: 'Hinjewadi Ph-1', mode: TransportMode.CAB, cost: 450 },
    { id: '7', date: '15 Oct, 09:00 AM', from: 'Kothrud', to: 'Deccan', mode: TransportMode.BUS, cost: 15 },
  ];

  const spendingData = [
    { month: 'Jun', amount: 1800 },
    { month: 'Jul', amount: 2200 },
    { month: 'Aug', amount: 2100 },
    { month: 'Sep', amount: 2800 },
    { month: 'Oct', amount: 2450 },
    { month: 'Nov', amount: 1200 }, // Current month
  ];

  const maxSpending = Math.max(...spendingData.map(d => d.amount));

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-32">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Travel Logs</h2>
          <p className="text-slate-500 text-sm font-medium">Insights and activity history.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('insights')}
            className={`p-2.5 rounded-xl transition-all ${activeTab === 'insights' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`p-2.5 rounded-xl transition-all ${activeTab === 'list' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            <History size={20} />
          </button>
        </div>
      </header>

      {activeTab === 'insights' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Spend Graph Card */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Spending (INR)</p>
                <h3 className="text-2xl font-black text-slate-800">₹2,450 <span className="text-xs text-emerald-500 font-bold ml-1">↓ 12%</span></h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                <TrendingUp size={22} />
              </div>
            </div>

            {/* Custom SVG Graph */}
            <div className="h-40 flex items-end justify-between px-2 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-slate-50"></div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-50"></div>
              
              {spendingData.map((d, i) => (
                <div key={d.month} className="flex flex-col items-center space-y-3 group flex-1">
                  <div className="relative w-full flex justify-center">
                    <div 
                      className={`w-4 rounded-full transition-all duration-1000 ease-out ${i === spendingData.length - 1 ? 'bg-indigo-600' : 'bg-slate-200 group-hover:bg-indigo-200'}`}
                      style={{ height: `${(d.amount / maxSpending) * 140}px` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        ₹{d.amount}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${i === spendingData.length - 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {d.month}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Transport Mode Analytics */}
          <section className="grid grid-cols-1 gap-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center space-x-2">
              <PieChart size={14} className="text-indigo-600" />
              <span>Transport Preferences</span>
            </h3>
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-lg space-y-6">
              {[
                { label: 'Pune Metro', mode: TransportMode.METRO, percentage: 65, color: 'bg-indigo-600', icon: Train },
                { label: 'PMPML Bus', mode: TransportMode.BUS, percentage: 20, color: 'bg-emerald-500', icon: Bus },
                { label: 'OLA/Uber', mode: TransportMode.CAB, percentage: 15, color: 'bg-amber-500', icon: Car },
              ].map(stat => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl bg-slate-50 text-slate-400`}>
                        <stat.icon size={16} />
                      </div>
                      <span className="text-xs font-black text-slate-700">{stat.label}</span>
                    </div>
                    <span className="text-xs font-black text-indigo-600">{stat.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} transition-all duration-1000`} 
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Extreme Journeys & Geo Insights */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
               <ArrowUpRight className="absolute -top-2 -right-2 text-white/5" size={80} />
               <div className="relative z-10 space-y-4">
                  <div className="bg-indigo-500/20 p-2.5 rounded-2xl w-fit">
                    <Zap size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Longest Journey</p>
                    <h4 className="font-black text-lg">22.4 km</h4>
                    <p className="text-[10px] text-white/50 font-medium">Baner → Hinjewadi</p>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
               <ArrowDownRight className="absolute -top-2 -right-2 text-white/5" size={80} />
               <div className="relative z-10 space-y-4">
                  <div className="bg-white/20 p-2.5 rounded-2xl w-fit">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Shortest Hop</p>
                    <h4 className="font-black text-lg">0.8 km</h4>
                    <p className="text-[10px] text-white/50 font-medium">Kothrud → Deccan</p>
                  </div>
               </div>
            </div>
          </section>

          {/* Geographical Insights */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Map size={16} className="text-indigo-600" />
              <span>Geo-Hotspots (Top Routes)</span>
            </h3>
            <div className="space-y-4">
              {[
                { from: 'Kothrud', to: 'Shivaji Nagar', trips: 14, icon: <MapPin size={14} /> },
                { from: 'Pune Station', to: 'Swargate', trips: 8, icon: <MapPin size={14} /> },
                { from: 'Vanaz', to: 'Civil Court', trips: 5, icon: <MapPin size={14} /> },
              ].map((route, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-transparent hover:border-indigo-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="text-indigo-600">{route.icon}</div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{route.from} ↔ {route.to}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{route.trips} Trips this month</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search past trips..."
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 ring-indigo-500/5 shadow-sm transition-all"
            />
          </div>
          
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex items-center space-x-5">
                  <div className={`p-4 rounded-2xl ${
                    item.mode === TransportMode.METRO ? 'bg-indigo-50 text-indigo-600' :
                    item.mode === TransportMode.BUS ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {item.mode === TransportMode.METRO && <Train size={24} />}
                    {item.mode === TransportMode.BUS && <Bus size={24} />}
                    {item.mode === TransportMode.CAB && <Car size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base flex items-center space-x-2">
                      <span className="truncate max-w-[100px]">{item.from}</span>
                      <span className="text-slate-300 text-xs">→</span>
                      <span className="truncate max-w-[100px]">{item.to}</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-lg">₹{item.cost}</p>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg mt-1 group-hover:bg-indigo-600 group-hover:text-white transition-all">Repeat</button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:border-indigo-300 hover:text-indigo-400 transition-all flex items-center justify-center space-x-3 mt-8">
            <Calendar size={14} />
            <span>Load Archive Logs</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
