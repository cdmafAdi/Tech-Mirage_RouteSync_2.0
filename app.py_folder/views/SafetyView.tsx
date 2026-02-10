
import React, { useState, useEffect, useRef } from 'react';
// Added ChevronRight to the import list to fix the "Cannot find name 'ChevronRight'" error
import { Shield, ShieldAlert, Phone, Navigation, Share2, MapPin, CheckCircle2, AlertCircle, X, Loader2, BellRing, ChevronRight } from 'lucide-react';
import L from 'leaflet';

interface SafetyIncident {
  id: string;
  type: string;
  lat: number;
  lng: number;
  timestamp: Date;
}

const SafetyView: React.FC = () => {
  const [sharing, setSharing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [reportingIssue, setReportingIssue] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const incidentLayer = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { 
        zoomControl: false, 
        attributionControl: false 
      }).setView([18.5204, 73.8567], 14);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);
      incidentLayer.current = L.layerGroup().addTo(mapInstance.current);
    }
  }, []);

  // Track User Location
  useEffect(() => {
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
            mapInstance.current.panTo([latitude, longitude]);
          } else {
            userMarker.current.setLatLng([latitude, longitude]);
          }
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const reportConcern = (issue: string) => {
    if (!userLocation) {
      alert("Locating you... Please try again in a second.");
      return;
    }

    setReportingIssue(issue);

    // Simulate Network Request
    setTimeout(() => {
      const newIncident: SafetyIncident = {
        id: Math.random().toString(36).substr(2, 9),
        type: issue,
        lat: userLocation.lat,
        lng: userLocation.lng,
        timestamp: new Date()
      };

      setIncidents(prev => [...prev, newIncident]);
      
      // Add Marker to Map
      if (incidentLayer.current) {
        const incidentIcon = L.divIcon({
          className: 'incident-marker',
          html: `<div class="bg-rose-500 text-white p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
                  <AlertCircle size={14} />
                 </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        L.marker([newIncident.lat, newIncident.lng], { icon: incidentIcon })
          .addTo(incidentLayer.current)
          .bindPopup(`<div class="p-2 font-black text-[10px] uppercase tracking-widest text-rose-600">${issue} reported here</div>`)
          .openPopup();
      }

      setNotification(`Thanks for reporting ${issue}. Pune Safety teams have been notified.`);
      setReportingIssue(null);

      // Auto-hide notification
      setTimeout(() => setNotification(null), 5000);
    }, 1200);
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-32">
      {/* Safety Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-4 right-4 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center space-x-4">
            <div className="bg-emerald-500 p-2.5 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Incident Logged</p>
              <p className="text-sm font-bold text-slate-100">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <header className="space-y-2">
        <div className="flex items-center space-x-3 text-indigo-600">
          <div className="bg-indigo-100 p-2 rounded-2xl">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Safety Hub</h2>
        </div>
        <p className="text-slate-500 text-sm font-medium">Real-time protection and geo-tagged incident reporting.</p>
      </header>

      {/* Incident Visualization Map */}
      <div className="relative h-64 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl group">
        <div ref={mapRef} className="w-full h-full z-10" />
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 text-[10px] font-black uppercase tracking-tight flex items-center space-x-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          <span>Incident Map Feed</span>
        </div>
        <button 
          onClick={() => userLocation && mapInstance.current?.flyTo([userLocation.lat, userLocation.lng], 16)}
          className="absolute bottom-4 right-4 z-20 bg-white p-3 rounded-2xl shadow-xl text-indigo-600 hover:bg-slate-50 transition-all active:scale-90"
        >
          <Navigation size={20} />
        </button>
      </div>

      <section className={`rounded-[2.5rem] p-8 text-white shadow-2xl transition-all duration-500 relative overflow-hidden ring-1 ring-white/10 ${sharing ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-900 shadow-slate-200'}`}>
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Guardian Protocol</p>
              <h3 className="text-2xl font-black tracking-tight">{sharing ? 'Location Sharing Active' : 'Journey Safety Check'}</h3>
            </div>
            <div className={`p-4 rounded-3xl backdrop-blur-md ${sharing ? 'bg-white/20' : 'bg-indigo-600/30'}`}>
              {sharing ? <BellRing size={28} className="animate-bounce" /> : <ShieldAlert size={28} />}
            </div>
          </div>
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xs">
            Our AI monitors your route. Your family will be alerted if your arrival is delayed by 15+ mins.
          </p>
          <button 
            onClick={() => setSharing(!sharing)}
            className={`w-full py-5 rounded-[2rem] font-black text-base flex items-center justify-center space-x-3 shadow-2xl transition-all active:scale-95 ${
              sharing ? 'bg-white text-emerald-700' : 'bg-indigo-600 text-white'
            }`}
          >
            {sharing ? <X size={22} /> : <Share2 size={22} />}
            <span>{sharing ? 'Stop Journey Share' : 'Start Journey Share'}</span>
          </button>
        </div>
        <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-white opacity-5 blur-[100px] pointer-events-none"></div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <a href="tel:100" className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col items-center justify-center space-y-3 group active:scale-95 transition-all">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-[1.8rem] group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
            <Phone size={28} />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Police (100)</span>
        </a>
        <a href="tel:108" className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col items-center justify-center space-y-3 group active:scale-95 transition-all">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-[1.8rem] group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
            <ShieldAlert size={28} />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Medical (108)</span>
        </a>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center space-x-2">
          <MapPin size={14} className="text-indigo-600" />
          <span>Report Safety Concern</span>
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {['Overcrowding', 'Suspicious Activity', 'Late Service', 'Reckless Driving'].map((issue) => (
            <button 
              key={issue} 
              disabled={reportingIssue !== null}
              onClick={() => reportConcern(issue)}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-left group active:scale-95"
            >
              <div className="flex items-center space-x-4">
                 <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                   {reportingIssue === issue ? <Loader2 size={20} className="animate-spin" /> : <ShieldAlert size={20} />}
                 </div>
                 <span className="text-sm font-black text-slate-700">{issue}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-all transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </section>
      
      <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-start space-x-4 shadow-inner">
        <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg">
          <Shield size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-indigo-900 tracking-tight">Guardian Mode Policy</h4>
          <p className="text-[11px] text-indigo-700 leading-relaxed font-bold opacity-70 mt-1">
            Guardian mode anonymizes your specific data while identifying travel anomalies. Reporting helps Pune improve transport safety for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyView;
