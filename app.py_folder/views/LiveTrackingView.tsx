
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ArrowLeft, MapPin, Clock, CreditCard, Activity, Bus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STOPS = {
  PUNE_STN: { name: "Pune Station (Moledina Stand)", latlng: [18.5279, 73.8727], kmFromStart: 0.0 },
  INCOME_TAX: { name: "Income Tax Office", latlng: [18.5249, 73.8768], kmFromStart: 0.7 },
  APPA_BALWANT: { name: "Appa Balwant Chowk", latlng: [18.5149, 73.8537], kmFromStart: 1.8 },
  DECCAN: { name: "Deccan Corner", latlng: [18.5135, 73.841], kmFromStart: 3.0 },
  GARWARE: { name: "Garware College", latlng: [18.5116, 73.8383], kmFromStart: 3.8 },
  SNDT: { name: "SNDT College", latlng: [18.5089, 73.8274], kmFromStart: 4.6 },
  PAUD_PHATA: { name: "Paud Phata", latlng: [18.5061, 73.8256], kmFromStart: 5.3 },
  MORE_VIDYALAYA: { name: "More Vidyalaya", latlng: [18.5073, 73.8062], kmFromStart: 6.0 },
  VANAZ_METRO: { name: "Vanaz Metro Station", latlng: [18.5072, 73.8053], kmFromStart: 7.2 },
  KOTHRUD: { name: "Kothrud Depot", latlng: [18.50801, 73.79503], kmFromStart: 8.0 },
};

const ROUTE_ORDER = ["PUNE_STN", "INCOME_TAX", "APPA_BALWANT", "DECCAN", "GARWARE", "SNDT", "PAUD_PHATA", "MORE_VIDYALAYA", "VANAZ_METRO", "KOTHRUD"];

const LiveTrackingView: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([18.5167, 73.8563], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

      const routeCoords = ROUTE_ORDER.map(id => (STOPS as any)[id].latlng as [number, number]);
      L.polyline(routeCoords, { color: '#2962ff', weight: 5 }).addTo(mapInstance.current);

      ROUTE_ORDER.forEach(id => {
        const stop = (STOPS as any)[id];
        L.circleMarker(stop.latlng, { radius: 4, color: '#2962ff', fillOpacity: 1 }).addTo(mapInstance.current!).bindPopup(stop.name);
      });

      const busIcon = L.divIcon({
        className: '',
        html: '<div style="width:20px;height:20px;border-radius:50%;background:#ff5722;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      busMarkerRef.current = L.marker(routeCoords[0], { icon: busIcon }).addTo(mapInstance.current);
    }

    const timer = setInterval(() => {
      setTime(new Date());
      updateBusPosition();
    }, 1000);

    const updateBusPosition = () => {
      if (!busMarkerRef.current) return;
      const now = new Date();
      const elapsedMin = (now.getTime() / 1000 / 60) % 40;
      let progress = elapsedMin / 40;
      
      let forward = true;
      if (progress > 0.5) {
        forward = false;
        progress = (progress - 0.5) * 2;
      } else {
        progress = progress * 2;
      }

      const coords = forward ? ROUTE_ORDER.map(id => (STOPS as any)[id].latlng) : [...ROUTE_ORDER].reverse().map(id => (STOPS as any)[id].latlng);
      const segCount = coords.length - 1;
      const segPos = progress * segCount;
      const segIndex = Math.min(Math.floor(segPos), segCount - 1);
      const segFrac = segPos - segIndex;

      const [lat1, lng1] = coords[segIndex];
      const [lat2, lng2] = coords[segIndex + 1];

      const lat = lat1 + (lat2 - lat1) * segFrac;
      const lng = lng1 + (lng2 - lng1) * segFrac;

      busMarkerRef.current.setLatLng([lat, lng]);
    };

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">Bus Route 372</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-80">Live Tracking</p>
        </div>
        <div className="font-mono font-bold text-sm bg-black/20 px-2 py-1 rounded">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0 z-0" />
        
        <div className="absolute bottom-4 left-4 right-4 z-10 space-y-3">
          <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg">
                <Bus size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Arrival</p>
                <p className="font-black text-slate-800">Pune Station → Kothrud</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-indigo-600">6 min</p>
              <p className="text-[9px] font-bold text-emerald-500 uppercase">On Time</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-t-[2rem] p-6 space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <MapPin size={18} className="text-indigo-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stops</span>
            <span className="font-black text-slate-800 text-sm">10</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <Clock size={18} className="text-indigo-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
            <span className="font-black text-slate-800 text-sm">40m</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <CreditCard size={18} className="text-indigo-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fare</span>
            <span className="font-black text-slate-800 text-sm">₹20</span>
          </div>
        </div>
        
        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-2">
             <Activity size={12} className="text-indigo-600" />
             <span>Route Stops</span>
           </h3>
           <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
              {ROUTE_ORDER.map((id, i) => (
                <div key={id} className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'}`}></div>
                    {i < ROUTE_ORDER.length - 1 && <div className="w-0.5 h-6 bg-slate-100 my-1"></div>}
                  </div>
                  <span className={`text-xs font-bold ${i === 0 ? 'text-indigo-600' : 'text-slate-600'}`}>{(STOPS as any)[id].name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingView;
