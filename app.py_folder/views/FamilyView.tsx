
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  Heart, 
  ChevronRight, 
  Trash2, 
  Camera, 
  X, 
  Check,
  Battery,
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  status: string;
  lastSeen: string;
  battery: string;
  avatar: string;
}

const FamilyView: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Anjali D.', role: 'Wife', status: 'At Work (Magarpatta)', lastSeen: '2 mins ago', battery: '85%', avatar: 'https://i.pravatar.cc/150?u=Anjali' },
    { id: '2', name: 'Rahul D.', role: 'Son', status: 'In Metro (Civil Court)', lastSeen: 'Just now', battery: '42%', avatar: 'https://i.pravatar.cc/150?u=Rahul' },
    { id: '3', name: 'Sameer D.', role: 'Father', status: 'Home (Kothrud)', lastSeen: '15 mins ago', battery: '91%', avatar: 'https://i.pravatar.cc/150?u=Sameer' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', avatar: '' });
  const [showEmergencyToast, setShowEmergencyToast] = useState(false);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);

  const handleOpenModal = (member?: FamilyMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({ name: member.name, role: member.role, avatar: member.avatar });
    } else {
      setEditingMember(null);
      setFormData({ name: '', role: '', avatar: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
    } else {
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: formData.name,
        role: formData.role,
        avatar: formData.avatar || `https://i.pravatar.cc/150?u=${formData.name}`,
        status: 'Just Joined',
        lastSeen: 'Now',
        battery: '100%'
      };
      setMembers([...members, newMember]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this family member from your circle?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const triggerEmergency = () => {
    setIsEmergencyLoading(true);
    // Simulate emergency protocol initiation
    setTimeout(() => {
      setIsEmergencyLoading(false);
      setShowEmergencyToast(true);
      // Auto hide after 6 seconds
      setTimeout(() => setShowEmergencyToast(false), 6000);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24 relative">
      {/* Emergency Toast Notification */}
      {showEmergencyToast && (
        <div className="fixed top-20 left-4 right-4 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-rose-600 text-white p-5 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center space-x-4">
            <div className="bg-white p-2.5 rounded-2xl text-rose-600">
              <AlertTriangle size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-100">SOS Active</p>
              <p className="text-sm font-bold text-white">Emergency is reported and family members are notified.</p>
            </div>
            <button onClick={() => setShowEmergencyToast(false)} className="text-white/60 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Family Hub</h2>
          <p className="text-slate-500 text-sm font-medium">Manage your safety circle.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <UserPlus size={22} />
        </button>
      </header>

      <section className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
            <span>Active Circle Members</span>
          </h3>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {members.length} MEMBERS
          </span>
        </div>
        
        <div className="space-y-4 relative z-10">
          {members.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Users size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-400">Your circle is empty.</p>
              <button onClick={() => handleOpenModal()} className="text-indigo-600 text-xs font-black mt-2 uppercase tracking-wider">Add someone now</button>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center justify-between group p-3 rounded-[1.5rem] hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden ring-2 ring-white shadow-md">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${member.name}&background=random`; }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    <button 
                      onClick={() => handleOpenModal(member)}
                      className="absolute -top-1 -left-1 bg-white p-1 rounded-lg shadow-md text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600"
                    >
                      <Camera size={12} />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-slate-800 text-sm">{member.name}</h4>
                      <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-lg text-slate-500 font-black uppercase tracking-tighter">{member.role}</span>
                    </div>
                    <p className="text-[11px] font-bold text-indigo-600 mt-0.5">{member.status}</p>
                    <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      <span className="flex items-center space-x-1">
                        <Clock size={10} />
                        <span>{member.lastSeen}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Battery size={10} className={parseInt(member.battery) < 20 ? 'text-red-500' : 'text-emerald-500'} />
                        <span>{member.battery}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-indigo-600 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="absolute top-0 right-0 -m-12 w-48 h-48 bg-indigo-50 rounded-full opacity-30 blur-3xl"></div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white border border-slate-100 text-slate-700 p-5 rounded-[2rem] shadow-lg flex flex-col items-center justify-center space-y-2 hover:bg-indigo-50 hover:border-indigo-100 transition-all active:scale-95">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 mb-1">
            <Bell size={24} />
          </div>
          <span className="text-xs font-black uppercase tracking-wider">Request Sync</span>
        </button>
        <button 
          onClick={triggerEmergency}
          disabled={isEmergencyLoading}
          className="bg-rose-500 text-white p-5 rounded-[2rem] shadow-xl shadow-rose-200 flex flex-col items-center justify-center space-y-2 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-80 disabled:scale-100"
        >
          <div className="bg-white/20 p-3 rounded-2xl mb-1 flex items-center justify-center">
            {isEmergencyLoading ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-white">Emergency</span>
        </button>
      </div>

      <section className="bg-indigo-900 rounded-[2.5rem] p-6 text-white flex items-center space-x-5 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
        <div className="bg-white/10 p-4 rounded-3xl shadow-lg relative z-10 flex-shrink-0">
          <Heart size={32} className="text-rose-400" />
        </div>
        <div className="relative z-10 space-y-1">
          <h4 className="font-black text-white text-sm uppercase tracking-tight">Family Guardian AI</h4>
          <p className="text-[11px] text-indigo-200 leading-relaxed font-medium">Auto-alerts family if your commute takes 15m+ longer than ETA. Privacy is maintained.</p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800">{editingMember ? 'Edit Profile' : 'Add New Member'}</h3>
              <button onClick={handleCloseModal} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:text-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  autoFocus
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 ring-indigo-500/20"
                  placeholder="e.g. Jayesh D."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role in Family</label>
                <input 
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 ring-indigo-500/20"
                  placeholder="e.g. Brother, Sister, Father"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Avatar URL (Optional)</label>
                <div className="flex space-x-3">
                  <input 
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 ring-indigo-500/20"
                    placeholder="https://..."
                  />
                  {formData.avatar && (
                    <div className="w-11 h-11 bg-slate-100 rounded-xl overflow-hidden border-2 border-indigo-100">
                      <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all active:scale-95 mt-4"
              >
                <Check size={20} />
                <span>{editingMember ? 'Update Circle' : 'Add to Circle'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyView;
