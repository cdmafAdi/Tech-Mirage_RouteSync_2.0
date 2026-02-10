
import React, { useState, useEffect, useRef } from 'react';
// Added X to the import list
import { Search, MapPin, Bus, Train, Car, ChevronRight, Navigation, LocateFixed, Info, Clock, IndianRupee, ArrowLeft, History, Star, Users, ExternalLink, Loader2, Sparkles, Map as MapIcon, Flag, X } from 'lucide-react';
import L from 'leaflet';
import { getRideEstimates } from '../geminiService';

const HomeView: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [to, setTo] = useState('');
  const [viewState, setViewState] = useState<'idle' | 'selecting' | 'fetching' | 'active'>('idle');
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [rideData, setRideData] = useState<any>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const simulationLayer = useRef<L.LayerGroup | null>(null);

  // Accurate Live Location Tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName('Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        if (mapInstance.current) {
          if (!userMarker.current) {
            const userIcon = L.divIcon({ 
              className: 'user-pulse-icon', 
              html: `<div class="user-pulse"></div>`, 
              iconSize: [12, 12] 
            });
            userMarker.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(mapInstance.current);
            if (viewState === 'idle') {
              mapInstance.current.setView([latitude, longitude], 15);
            }
          } else {
            userMarker.current.setLatLng([latitude, longitude]);
          }
        }
        
        if (locationName === 'Detecting location...') {
          setLocationName('My Current Location');
        }
      },
      (err) => {
        console.error("Location Error:", err);
        setLocationName('Location Access Denied');
        const fallback = { lat: 18.5204, lng: 73.8567 };
        setUserLocation(fallback);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [viewState]);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { 
        zoomControl: false, 
        attributionControl: false 
      }).setView([18.5204, 73.8567], 13);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);
      simulationLayer.current = L.layerGroup().addTo(mapInstance.current);
    }
  }, []);

  const selectDestination = async (dest: string) => {
    setTo(dest);
    setIsSearching(false);
    setViewState('fetching');
    
    if (userLocation) {
      const estimates = await getRideEstimates(userLocation, dest);
      if (estimates && estimates.routePolyline) {
        setRideData(estimates);
        setViewState('selecting');
        
        // Draw Accurate AI-Generated Route
        if (mapInstance.current && simulationLayer.current) {
          simulationLayer.current.clearLayers();
          
          const pathCoords: [number, number][] = estimates.routePolyline.map((p: any) => [p.lat, p.lng]);
          
          // Draw Main Route Path
          const routeLine = L.polyline(pathCoords, { 
            color: '#4f46e5', 
            weight: 6,
            opacity: 0.8,
            lineJoin: 'round'
          }).addTo(simulationLayer.current);

          // Add Glow Effect
          L.polyline(pathCoords, { 
            color: '#818cf8', 
            weight: 12,
            opacity: 0.2,
            lineJoin: 'round'
          }).addTo(simulationLayer.current);
          
          // Add Destination Marker
          const lastPoint = pathCoords[pathCoords.length - 1];
          L.marker(lastPoint, {
            icon: L.divIcon({
              className: 'dest-marker',
              html: `<div class="bg-indigo-600 p-2 rounded-2xl shadow-2xl text-white transform -translate-y-4 animate-bounce border-2 border-white flex items-center justify-center">
                       <Flag size={16} fill="white" />
                     </div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32]
            })
          }).addTo(simulationLayer.current);

          // Fly to fit the entire journey
          mapInstance.current.flyToBounds(simulationLayer.current.getBounds(), { 
            padding: [80, 80],
            duration: 1.5
          });
        }
      } else {
        setViewState('idle');
        alert("Failed to plan route. Please try a different destination.");
      }
    }
  };

  const handleBook = () => {
    if (!selectedRideId) return;
    const isUber = selectedRideId.includes('uber');
    const url = isUber ? 'https://www.uber.com/' : 'https://book.olacabs.com/';
    window.open(url, '_blank');
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-50">
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* TOP SEARCH OVERLAY */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none">
        <div className="mx-auto max-w-md w-full space-y-3 pointer-events-auto">
          {viewState !== 'active' && viewState !== 'fetching' && (
            <div className="flex items-center space-x-3">
               <button 
                 onClick={() => { setViewState('idle'); simulationLayer.current?.clearLayers(); }}
                 className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 text-slate-800 hover:bg-slate-50 transition-all active:scale-90"
               >
                  {viewState === 'selecting' ? <ArrowLeft size={20} /> : <History size={20} />}
               </button>
               <div 
                 onClick={() => setIsSearching(true)}
                 className="flex-1 bg-white p-4.5 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-4 cursor-pointer group hover:border-indigo-200 transition-all"
               >
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-lg animate-pulse"></div>
                  <span className={`text-sm font-black tracking-tight ${to ? 'text-slate-800' : 'text-slate-400'} group-hover:text-slate-600`}>
                    {to || 'Where to?'}
                  </span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* FETCHING LOADER */}
      {viewState === 'fetching' && (
        <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center space-y-6 border border-slate-100">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-50 rounded-full animate-ping opacity-25"></div>
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative" />
              <Sparkles className="w-6 h-6 text-indigo-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Planning Best Route</h3>
              <p className="text-sm font-medium text-slate-500">RAAHI AI is analyzing road traffic...</p>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {isSearching && (
        <div className="absolute inset-0 z-50 bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
           <div className="p-6 border-b border-slate-100 flex items-center space-x-4">
              <button onClick={() => setIsSearching(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                 <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Travel Request</h2>
           </div>
           
           <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="relative">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-200"></div>
                    <div className="w-0.5 h-8 bg-slate-100"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-black shadow-sm"></div>
                 </div>
                 <div className="ml-12 space-y-3">
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between">
                       <span className="text-sm font-bold text-slate-800 truncate pr-4">{locationName}</span>
                       <div className="flex items-center space-x-2">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black text-emerald-600 uppercase">Live</span>
                       </div>
                    </div>
                    <input 
                      autoFocus
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 ring-indigo-500/10 transition-all" 
                      placeholder="Enter destination in Pune"
                      onKeyPress={(e) => e.key === 'Enter' && selectDestination(to)}
                    />
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Recommended Spots</h4>
                 {[
                   { name: 'Koregaon Park', area: 'East Pune', time: '12m' },
                   { name: 'Balewadi High Street', area: 'Baner', time: '25m' },
                   { name: 'Amanora Mall', area: 'Hadapsar', time: '30m' },
                   { name: 'Symbiosis Campus', area: 'Viman Nagar', time: '20m' },
                 ].map(loc => (
                   <button 
                    key={loc.name}
                    onClick={() => selectDestination(loc.name)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100 group"
                   >
                      <div className="flex items-center space-x-5">
                        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all"><MapPin size={20} /></div>
                        <div className="text-left">
                           <p className="text-sm font-black text-slate-800">{loc.name}</p>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{loc.area}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-500">{loc.time}</p>
                        <ChevronRight size={16} className="text-slate-300 ml-auto mt-1" />
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* RIDE COMPARISON DRAWER */}
      {viewState === 'selecting' && rideData && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-[3.5rem] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-20 duration-500 border-t border-slate-100 max-h-[85vh] flex flex-col">
           <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-5 mb-3"></div>
           
           <div className="px-8 pb-4 flex items-center justify-between border-b border-slate-50">
              <div className="space-y-1">
                 <div className="flex items-center space-x-2">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Fastest Route</h3>
                   <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">Low Traffic</div>
                 </div>
                 <div className="flex items-center space-x-3">
                   <div className="flex items-center space-x-1.5 text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-full">
                     <Clock size={12} />
                     <span>{rideData.estimatedTimeMins} MINS</span>
                   </div>
                   <div className="flex items-center space-x-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-full">
                     <Navigation size={12} />
                     <span>{rideData.estimatedDistanceKm} KM</span>
                   </div>
                 </div>
              </div>
              <button 
                onClick={() => { setViewState('idle'); simulationLayer.current?.clearLayers(); }} 
                className="bg-slate-50 p-3 rounded-2xl text-slate-400 hover:text-slate-800 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-5">
              {/* OLA SECTION */}
              <div className="space-y-4">
                 <div className="flex items-center justify-center space-x-2 pb-2">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Ola_Cabs_logo.svg/1200px-Ola_Cabs_logo.svg.png" alt="Ola" className="h-6 grayscale opacity-60" />
                    <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">OLA</span>
                 </div>
                 {rideData.ola.map((ride: any) => (
                    <button
                      key={ride.id}
                      onClick={() => setSelectedRideId(`ola-${ride.id}`)}
                      className={`w-full p-4 rounded-3xl transition-all text-left border-2 ${
                        selectedRideId === `ola-${ride.id}` 
                        ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-500/10 scale-[1.03]' 
                        : 'border-slate-50 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                       <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-2xl ${selectedRideId === `ola-${ride.id}` ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                             {ride.name.includes('SUV') ? <Users size={18} /> : <Car size={18} />}
                          </div>
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{ride.name}</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-lg font-black text-slate-900 tracking-tight">₹{ride.price}</p>
                             <p className="text-[10px] font-black text-emerald-600 uppercase">{ride.eta}</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>

              {/* UBER SECTION */}
              <div className="space-y-4">
                 <div className="flex items-center justify-center space-x-2 pb-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="Uber" className="h-4 grayscale opacity-60" />
                    <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">UBER</span>
                 </div>
                 {rideData.uber.map((ride: any) => (
                    <button
                      key={ride.id}
                      onClick={() => setSelectedRideId(`uber-${ride.id}`)}
                      className={`w-full p-4 rounded-3xl transition-all text-left border-2 ${
                        selectedRideId === `uber-${ride.id}` 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.03]' 
                        : 'border-slate-50 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                       <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-2xl ${selectedRideId === `uber-${ride.id}` ? 'bg-white text-black' : 'bg-white text-slate-400 shadow-sm'}`}>
                            {ride.name.includes('XL') ? <Users size={18} /> : <Car size={18} />}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-tight ${selectedRideId === `uber-${ride.id}` ? 'text-white' : 'text-slate-900'}`}>{ride.name}</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <div>
                             <p className={`text-lg font-black tracking-tight ${selectedRideId === `uber-${ride.id}` ? 'text-white' : 'text-slate-900'}`}>₹{ride.price}</p>
                             <p className={`text-[10px] font-black uppercase ${selectedRideId === `uber-${ride.id}` ? 'text-slate-400' : 'text-indigo-600'}`}>{ride.eta}</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-white border-t border-slate-100">
              <button 
                disabled={!selectedRideId}
                onClick={handleBook}
                className={`w-full py-6 rounded-[2.5rem] font-black text-xl transition-all flex items-center justify-center space-x-4 shadow-2xl ${
                  selectedRideId 
                  ? 'bg-black text-white hover:bg-slate-800 active:scale-95 shadow-slate-900/30 ring-4 ring-black/5' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                 <Sparkles size={24} className={selectedRideId ? 'text-indigo-400' : 'text-slate-300'} />
                 <span>{selectedRideId ? `Confirm ${selectedRideId.split('-')[1].toUpperCase()}` : 'Select a Category'}</span>
                 <ChevronRight size={24} />
              </button>
              <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-6">
                Official RAAHI AI Prediction Hub
              </p>
           </div>
        </div>
      )}

      {/* FLOAT ACTION: RECENTER */}
      <button 
        onClick={() => userLocation && mapInstance.current?.flyTo([userLocation.lat, userLocation.lng], 16)}
        className="absolute bottom-32 right-6 z-20 bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-100 text-slate-800 hover:bg-slate-50 active:scale-90 transition-all flex items-center justify-center"
      >
        <LocateFixed size={26} />
      </button>
    </div>
  );
};

export default HomeView;
