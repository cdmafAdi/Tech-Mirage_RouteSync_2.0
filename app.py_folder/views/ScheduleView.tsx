
import React, { useState, useEffect, useRef } from 'react';
import { Bus, Train, Search, Clock, ArrowRight, LocateFixed, Info, ChevronLeft, ChevronRight, MapPin, Check, RefreshCcw, ShieldCheck, Loader2, ExternalLink, Ticket, Timer, Zap, IndianRupee, TrendingUp, X, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { PMPML_BUSES, METRO_PURPLE_COORDS, METRO_AQUA_COORDS, BUS_ROUTE_10_PATH, BUS_ROUTE_1_PATH, BUS_ROUTE_5_PATH } from '../constants';

const getDistance = (p1: any, p2: any) => {
  const R = 6371e3;
  const phi1 = p1.lat * Math.PI/180;
  const phi2 = p2.lat * Math.PI/180;
  const dphi = (p2.lat - p1.lat) * Math.PI/180;
  const dlambda = (p2.lng - p1.lng) * Math.PI/180;
  const a = Math.sin(dphi/2) * Math.sin(dphi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dlambda/2) * Math.sin(dlambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const LiveNetworkMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markers = useRef<{ [key: string]: L.Marker }>({});

  const sims = useRef([
    { id: 'm_aqua_1', path: METRO_AQUA_COORDS, currentIdx: 0, progress: 0.1, wait: 0, color: 'bg-indigo-600', type: 'train', speed: 50 },
    { id: 'm_aqua_2', path: METRO_AQUA_COORDS, currentIdx: 5, progress: 0.6, wait: 0, color: 'bg-indigo-600', type: 'train', speed: 50 },
    { id: 'm_purple_1', path: METRO_PURPLE_COORDS, currentIdx: 2, progress: 0.3, wait: 0, color: 'bg-purple-600', type: 'train', speed: 50 },
    { id: 'b_10_1', path: BUS_ROUTE_10_PATH, currentIdx: 0, progress: 0.2, wait: 0, color: 'bg-emerald-600', type: 'bus', speed: 30 },
    { id: 'b_1_1', path: BUS_ROUTE_1_PATH, currentIdx: 3, progress: 0.8, wait: 0, color: 'bg-emerald-600', type: 'bus', speed: 30 },
    { id: 'b_5_1', path: BUS_ROUTE_5_PATH, currentIdx: 1, progress: 0.4, wait: 0, color: 'bg-emerald-600', type: 'bus', speed: 30 }
  ]);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([18.5204, 73.8567], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);

      const createIcon = (color: string, type: string) => L.divIcon({
        className: 'network-icon',
        html: `<div class="${color} text-white p-1 rounded-lg border border-white shadow-lg transition-transform duration-300">
                ${type === 'train' ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M7 18h10"/></svg>' : 
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L16 10H5c-1.1 0-2 .9-2 2v7h2"/></svg>'}
               </div>`,
        iconSize: [20, 20]
      });

      sims.current.forEach(sim => {
        markers.current[sim.id] = L.marker([sim.path[sim.currentIdx].lat, sim.path[sim.currentIdx].lng], {
          icon: createIcon(sim.color, sim.type)
        }).addTo(mapInstance.current!);
      });
    }

    const intervalMs = 150;
    const timer = setInterval(() => {
      sims.current.forEach(sim => {
        if (sim.wait > 0) {
          sim.wait--;
          markers.current[sim.id]?.getElement()?.classList.add('animate-pulse');
          return;
        }
        markers.current[sim.id]?.getElement()?.classList.remove('animate-pulse');

        const p1 = sim.path[sim.currentIdx];
        const p2 = sim.path[(sim.currentIdx + 1) % sim.path.length];
        const dist = getDistance(p1, p2);
        
        const velocityMps = (sim.speed * 1000) / 3600;
        const delta = (velocityMps * (intervalMs / 1000)) / dist;
        
        sim.progress += delta;

        if (sim.progress >= 1) {
          sim.progress = 0;
          sim.currentIdx = (sim.currentIdx + 1) % (sim.path.length - 1);
          sim.wait = sim.type === 'bus' ? 20 : 12;
          if (sim.currentIdx === 0) markers.current[sim.id]?.setLatLng([sim.path[0].lat, sim.path[0].lng]);
        }

        const pNext = sim.path[(sim.currentIdx + 1) % sim.path.length];
        const lat = sim.path[sim.currentIdx].lat + (pNext.lat - sim.path[sim.currentIdx].lat) * sim.progress;
        const lng = sim.path[sim.currentIdx].lng + (pNext.lng - sim.path[sim.currentIdx].lng) * sim.progress;
        
        markers.current[sim.id]?.setLatLng([lat, lng]);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 mb-4 shadow-inner group">
      <div ref={mapRef} className="w-full h-full z-10" />
      <div className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm border border-slate-100 text-[10px] font-black uppercase tracking-tight flex items-center space-x-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
        <span>Pune Live Network Feed</span>
      </div>
    </div>
  );
};

const ScheduleView: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'bus' | 'metro'>('metro');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const paymentTimerRef = useRef<number | null>(null);

  const filteredBuses = PMPML_BUSES.filter(b => 
    b.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.route_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayNowRedirect = () => {
    setIsProcessingPayment(true);
    paymentTimerRef.current = window.setTimeout(() => {
      setIsProcessingPayment(false);
      window.open('https://www.punemetrorail.org/plan-your-journey', '_blank');
    }, 2000);
  };

  const cancelPaymentRedirect = () => {
    if (paymentTimerRef.current) {
      clearTimeout(paymentTimerRef.current);
      paymentTimerRef.current = null;
    }
    setIsProcessingPayment(false);
  };

  useEffect(() => {
    return () => {
      if (paymentTimerRef.current) clearTimeout(paymentTimerRef.current);
    };
  }, []);

  const purpleStations = [
    "PCMC", "Sant Tukaram Nagar", "Bhosari", "Kasarwadi", "Phugewadi", "Dapodi", "Bopodi", "Khadki", "Range Hill", "Shivaji Nagar", "District Court", "Kasba Peth", "Mandai", "Swargate"
  ];

  const aquaStations = [
    "Vanaz", "Anand Nagar", "Ideal Colony", "Nal Stop", "Garware College", "Deccan Gymkhana", "PMC", "District Court", "Mangalwar Peth", "Pune Railway Station", "Ruby Hall Clinic", "Bund Garden", "Yerawada", "Kalyani Nagar", "Ramwadi"
  ];

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto relative">
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[100] bg-indigo-900/98 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
           <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10 flex flex-col items-center space-y-8 w-full max-w-md shadow-2xl">
              <div className="relative">
                <div className="absolute -inset-8 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
                <Loader2 className="text-white w-20 h-20 animate-spin opacity-30" />
                <ShieldCheck className="text-emerald-400 w-12 h-12 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-3">
                 <h2 className="text-3xl font-black text-white tracking-tight">Connecting...</h2>
                 <p className="text-indigo-200 text-sm font-bold leading-relaxed">
                   Redirecting to official Pune Metro ticketing portal.
                 </p>
              </div>
              <button 
                onClick={cancelPaymentRedirect}
                className="mt-4 flex items-center space-x-3 text-white/50 hover:text-white transition-all group font-black uppercase text-[10px] tracking-widest"
              >
                <X size={16} className="group-hover:rotate-90 transition-transform" />
                <span>Cancel & Return</span>
              </button>
           </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
          {tab === 'metro' ? 'Metro Services' : 'PMPML Routes'}
        </h2>
        <div className="flex bg-slate-200 p-1 rounded-2xl">
          <button 
            onClick={() => setTab('metro')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'metro' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500'}`}
          >
            Metro
          </button>
          <button 
            onClick={() => setTab('bus')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'bus' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}
          >
            PMPML
          </button>
        </div>
      </div>

      <LiveNetworkMap />

      {tab === 'metro' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="grid grid-cols-2 gap-4">
            {/* Purple Line */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
              <div className="bg-[#8b5cf6] p-4 text-white text-center shadow-lg">
                <h4 className="font-black text-xs uppercase tracking-[0.2em]">Purple Line</h4>
                <p className="text-[9px] font-bold opacity-80 mt-1">PCMC to Swargate</p>
              </div>
              <div className="p-5 space-y-3 max-h-[450px] overflow-y-auto scrollbar-hide flex-1 bg-gradient-to-b from-white to-slate-50">
                {purpleStations.map((station, i) => (
                  <div key={i} className="flex items-center space-x-3 group">
                    <div className="flex flex-col items-center">
                      <Circle size={10} className="text-[#8b5cf6] fill-[#8b5cf6] group-hover:scale-125 transition-transform" />
                      {i < purpleStations.length - 1 && <div className="w-0.5 h-6 bg-purple-100"></div>}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-[12px] font-black text-slate-800 group-hover:text-purple-600 transition-colors">{station}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Every 6 mins</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aqua Line */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
              <div className="bg-[#0ea5e9] p-4 text-white text-center shadow-lg">
                <h4 className="font-black text-xs uppercase tracking-[0.2em]">Aqua Line</h4>
                <p className="text-[9px] font-bold opacity-80 mt-1">Vanaz to Ramwadi</p>
              </div>
              <div className="p-5 space-y-3 max-h-[450px] overflow-y-auto scrollbar-hide flex-1 bg-gradient-to-b from-white to-slate-50">
                {aquaStations.map((station, i) => (
                  <div key={i} className="flex items-center space-x-3 group">
                    <div className="flex flex-col items-center">
                      <Circle size={10} className="text-[#0ea5e9] fill-[#0ea5e9] group-hover:scale-125 transition-transform" />
                      {i < aquaStations.length - 1 && <div className="w-0.5 h-6 bg-sky-100"></div>}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-[12px] font-black text-slate-800 group-hover:text-sky-600 transition-colors">{station}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Every 10 mins</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timetable Image */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 flex items-center space-x-2">
              <Clock size={12} className="text-indigo-600" />
              <span>Official Time Table</span>
            </h3>
            <div className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden mx-1">
              <img 
                src="tt.jpeg" 
                alt="Metro Time Table" 
                className="w-full h-auto rounded-[1.8rem]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/Jayesh-Deshmukh/RouteSync/main/public/tt.jpeg';
                }}
              />
            </div>
          </div>

          <div className="px-1">
            <button 
              onClick={handlePayNowRedirect}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-lg shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-4 active:scale-95 shadow-emerald-500/20"
            >
              <Ticket size={24} className="animate-pulse" />
              <span className="tracking-widest">GENERATE QR TICKET</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-4">
              Official Pune Metro Ticketing System
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by number or area..." 
              className="w-full bg-white border border-slate-200 rounded-3xl py-4.5 pl-12 pr-6 text-sm font-black focus:outline-none focus:ring-4 ring-emerald-500/10 shadow-sm transition-all"
            />
          </div>
          <div className="grid gap-4 pb-24">
            {filteredBuses.map((bus) => (
              <div 
                key={bus.route_number} 
                onClick={() => setSelectedBus(bus)}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center space-x-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    {bus.route_number}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 font-black text-slate-800 text-base">
                      <span className="truncate max-w-[110px]">{bus.origin}</span>
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      <span className="truncate max-w-[110px]">{bus.destination}</span>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      <span className="flex items-center space-x-1"><Clock size={10} /> <span>{bus.frequency}</span></span>
                      <span className="flex items-center space-x-1"><MapPin size={10} /> <span>{bus.stopsCount} Stops</span></span>
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                   <ChevronRight className="text-slate-200 group-hover:text-emerald-500 transition-all transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedBus && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSelectedBus(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-600">
                <ChevronLeft size={24} />
              </button>
              <div>
                <h2 className="font-black text-slate-800 tracking-tight">Bus {selectedBus.route_number}</h2>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">PMPML Official Schedule</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-8 pb-32">
             <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-slate-800">{selectedBus.origin} ↔ {selectedBus.destination}</h1>
                <p className="text-sm font-bold text-slate-500">Route Number: {selectedBus.route_number}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase">Frequency</p>
                   <p className="font-black text-slate-800 text-lg">{selectedBus.frequency}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase">Distance</p>
                   <p className="font-black text-slate-800 text-lg">{selectedBus.approx_distance_km} KM</p>
                </div>
             </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 z-10">
            <button 
              onClick={() => window.open('https://pmpml.org/', '_blank')}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-base shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all"
            >
              <span>OFFICIAL PMPML PORTAL</span>
              <ExternalLink size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
