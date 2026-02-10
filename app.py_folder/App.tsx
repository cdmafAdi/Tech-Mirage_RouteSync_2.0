
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map as MapIcon, 
  Clock, 
  History, 
  Users, 
  Compass, 
  MessageSquare, 
  Shield, 
  Navigation,
  Search,
  ChevronRight,
  TrendingUp,
  MapPin,
  Menu,
  X,
  Bell,
  Bus,
  Train
} from 'lucide-react';
import HomeView from './views/HomeView';
import ScheduleView from './views/ScheduleView';
import HistoryView from './views/HistoryView';
import PlanView from './views/PlanView';
import ChatbotView from './views/ChatbotView';
import FamilyView from './views/FamilyView';
import SafetyView from './views/SafetyView';
import LiveTrackingView from './views/LiveTrackingView';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center space-y-1 py-2 px-1 transition-all duration-200 ${
        isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-indigo-400'
      }`
    }
  >
    <Icon size={24} />
    <span className="text-[10px] uppercase tracking-wider">{label}</span>
  </NavLink>
);

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HashRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-2 sticky top-0 z-30 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <img 
                src="logo.png" 
                alt="Route Sync Logo" 
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to icon if image is missing
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="fallback-icon hidden bg-indigo-600 p-2 rounded-lg text-white">
                <Navigation size={22} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-indigo-900 leading-none">Route Sync</h1>
              <p className="text-[9px] text-indigo-500 font-black tracking-widest uppercase mt-0.5">Smart Pune Commute</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-indigo-600 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-slate-600 hover:text-indigo-600"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold uppercase">JD</div>
              <span className="text-xs font-semibold text-indigo-900">Jayesh Deshmukh</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6 relative">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/schedules" element={<ScheduleView />} />
            <Route path="/live-tracking" element={<LiveTrackingView />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/plan" element={<PlanView />} />
            <Route path="/chat" element={<ChatbotView />} />
            <Route path="/family" element={<FamilyView />} />
            <Route path="/safety" element={<SafetyView />} />
          </Routes>
        </main>

        {/* Floating AI Chat Trigger (Small) */}
        <NavLink to="/chat" className="fixed bottom-24 right-6 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center">
          <MessageSquare size={28} />
        </NavLink>

        {/* Mobile Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-around items-center px-2 py-1 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/schedules" icon={Clock} label="Times" />
          <NavItem to="/plan" icon={Compass} label="Plan" />
          <NavItem to="/family" icon={Users} label="Family" />
          <NavItem to="/safety" icon={Shield} label="Safety" />
          <NavItem to="/history" icon={History} label="Past" />
        </nav>
      </div>
    </HashRouter>
  );
};

export default App;
