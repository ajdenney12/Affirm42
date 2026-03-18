
import React, { useState, useEffect, useRef } from 'react';
import { View, Announcement, AdminUser, ButtonLinks, ResourceDocument, ButtonResources, Contact } from './src/types';
import { BRAND, DIRECTORY_DATA } from './constants';
import Layout from './components/Layout';
import TopicButtons from './components/TopicButtons';
import Directory from './components/Directory';
import Menus from './components/Menus';
import RequestForms from './components/RequestForms';
import CampusInfo from './components/CampusInfo';
import DoigHealthClub from './components/DoigHealthClub';
import { getAnswerStream, generateSpeech, decodeAudioBuffer } from './services/geminiService';
import { RESIDENT_DATA } from './src/residents';

const SHARED_ADMIN_PASSWORD = 'LANDING12';

const INITIAL_ADMINS: AdminUser[] = [
  { id: '1', email: 'adenney@williamsburglanding.com' }
];

const DEFAULT_LINKS: ButtonLinks = {
  fullCount: 'https://portal.fullcount.net/authorization/customers/customer-login',
  firstMate: 'https://us4.campaign-archive.com/home/?u=313e62a1c8c795b62bf98076b&id=e3606cd43b',
  requestForms: 'https://www.williamsburglanding.com/staff-resources',
  directorySheet: '' 
};

const INITIAL_CATEGORY_STRUCTURE: Record<string, string[]> = {
  'Campus Information': [
    'Staff Meetings & Program Recordings',
    'Staff Training Recordings',
    'IL Clinic',
    'Doig Health Club & Spa',
    'Maps',
    'Recycling',
    'Staff Committee',
    'Flea Market',
    'Notaries',
    'Event Calendar'
  ],
  'Request Forms': [
    'Handyman Services Form',
    'Guest Room Reservations Form',
    'Meal Plan Change Request Form',
    'Transportation Request Form',
    'Housekeeping Request Form',
    'Employee Spot Award Request Form'
  ],
  'Menus': [
    'Beverages Menu',
    'Sunday Brunch Menu',
    'The Cove - Daily Menu',
    'Specials: Main Dining Room',
    'Specials: Cove Take Out',
    'Specials: Cove Dine In',
    'Main Dining Room Dinner'
  ],
  'Directory': ['General'],
  'FullCount': ['General'],
  'First Mate Emails': ['General']
};

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.SPLASH);
  const [loginMode, setLoginMode] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [campusCode, setCampusCode] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  
  // App Data State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [buttonLinks, setButtonLinks] = useState<ButtonLinks>(DEFAULT_LINKS);
  const [resources, setResources] = useState<ButtonResources>({});
  const [categoryStructure, setCategoryStructure] = useState<Record<string, string[]>>(INITIAL_CATEGORY_STRUCTURE);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Admin UI State
  const [adminActiveTab, setAdminActiveTab] = useState<'COMMUNITY' | 'DOCUMENTS' | 'DIRECTORY' | 'SYSTEM'>('COMMUNITY');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState<string>(Object.keys(INITIAL_CATEGORY_STRUCTURE)[0]);
  const [selectedAdminSubCategory, setSelectedAdminSubCategory] = useState<string>(INITIAL_CATEGORY_STRUCTURE[Object.keys(INITIAL_CATEGORY_STRUCTURE)[0]][0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newButtonName, setNewButtonName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [storageUsage, setStorageUsage] = useState(0);

  // New Contact Form State
  const [newContact, setNewContact] = useState<Partial<Contact>>({ category: 'Staff' });

  // Frontend UI State
  const [viewingDocs, setViewingDocs] = useState<{title: string, docs: ResourceDocument[]} | null>(null);
  const [inputText, setInputText] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Uint8Array | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);
  const isPlayingQueueRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAllData();
    calculateStorage();
    
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const loadAllData = () => {
    const savedAnnouncements = localStorage.getItem('wl_announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    
    const savedAdmins = localStorage.getItem('wl_admin_users');
    if (savedAdmins) {
      setAdminUsers(JSON.parse(savedAdmins));
    } else {
      setAdminUsers(INITIAL_ADMINS);
      localStorage.setItem('wl_admin_users', JSON.stringify(INITIAL_ADMINS));
    }

    const savedLinks = localStorage.getItem('wl_button_links');
    if (savedLinks) setButtonLinks(JSON.parse(savedLinks));

    const savedResources = localStorage.getItem('wl_button_resources');
    if (savedResources) setResources(JSON.parse(savedResources));

    const savedContacts = localStorage.getItem('wl_contacts');
    const mappedInitial: Contact[] = DIRECTORY_DATA.map((c, i) => ({ ...c, id: `init-${i}` }));
    
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      setContacts(mappedInitial);
      localStorage.setItem('wl_contacts', JSON.stringify(mappedInitial));
    }

    const savedStructureStr = localStorage.getItem('wl_category_structure');
    if (savedStructureStr) {
      const saved = JSON.parse(savedStructureStr);
      const merged = { ...saved };
      
      // Cleanup old menu name
      if (merged['Menus']) {
        merged['Menus'] = merged['Menus'].filter((item: string) => item !== 'Weekly Specials');
      }

      Object.keys(INITIAL_CATEGORY_STRUCTURE).forEach(cat => {
        if (!merged[cat]) {
          merged[cat] = INITIAL_CATEGORY_STRUCTURE[cat];
        } else {
          INITIAL_CATEGORY_STRUCTURE[cat].forEach(item => {
            if (!merged[cat].includes(item)) {
              merged[cat].push(item);
            }
          });
        }
      });
      setCategoryStructure(merged);
    } else {
      setCategoryStructure(INITIAL_CATEGORY_STRUCTURE);
      localStorage.setItem('wl_category_structure', JSON.stringify(INITIAL_CATEGORY_STRUCTURE));
    }
  };

  const calculateStorage = () => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += ((localStorage[x].length + x.length) * 2);
      }
    }
    setStorageUsage(Math.min(100, (total / (5 * 1024 * 1024)) * 100));
  };

  const handleExportData = () => {
    const data = {
      announcements,
      adminUsers,
      buttonLinks,
      resources,
      categoryStructure,
      contacts,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wl-portal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm("This will overwrite all current portal settings, directory, and documents with the backup file. Continue?")) {
          if (data.announcements) localStorage.setItem('wl_announcements', JSON.stringify(data.announcements));
          if (data.adminUsers) localStorage.setItem('wl_admin_users', JSON.stringify(data.adminUsers));
          if (data.buttonLinks) localStorage.setItem('wl_button_links', JSON.stringify(data.buttonLinks));
          if (data.resources) localStorage.setItem('wl_button_resources', JSON.stringify(data.resources));
          if (data.categoryStructure) localStorage.setItem('wl_category_structure', JSON.stringify(data.categoryStructure));
          if (data.contacts) localStorage.setItem('wl_contacts', JSON.stringify(data.contacts));
          alert("Data imported successfully! The portal has been updated.");
          window.location.reload();
        }
      } catch (err) {
        alert("Error importing data.");
      }
    };
    reader.readAsText(file);
  };

  const handleUpdateLink = (key: keyof ButtonLinks, val: string) => {
    const updated = { ...buttonLinks, [key]: val };
    setButtonLinks(updated);
    localStorage.setItem('wl_button_links', JSON.stringify(updated));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      alert("Name and Phone are required.");
      return;
    }
    const c: Contact = {
      id: Date.now().toString(),
      name: newContact.name!,
      firstName: newContact.firstName || '',
      lastName: newContact.lastName || '',
      info: newContact.info || '',
      phone: newContact.phone!,
      secondaryPhone: newContact.secondaryPhone || '',
      email: newContact.email || '',
      address: newContact.address || '',
      category: (newContact.category as 'Staff' | 'Resident') || 'Resident'
    };
    const updated = [c, ...contacts];
    setContacts(updated);
    localStorage.setItem('wl_contacts', JSON.stringify(updated));
    setNewContact({ category: 'Staff' });
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Remove this contact from the directory?")) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      localStorage.setItem('wl_contacts', JSON.stringify(updated));
    }
  };

  const handleAddAnnouncement = () => {
    const input = document.getElementById('ann-inp') as HTMLInputElement;
    if (input && input.value) {
      const newList = [{ id: Date.now().toString(), text: input.value, timestamp: Date.now() }, ...announcements];
      setAnnouncements(newList);
      localStorage.setItem('wl_announcements', JSON.stringify(newList));
      input.value = '';
    }
  };

  const handleAddAdmin = () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    const newAdmin: AdminUser = { id: Date.now().toString(), email };
    const updated = [...adminUsers, newAdmin];
    setAdminUsers(updated);
    localStorage.setItem('wl_admin_users', JSON.stringify(updated));
    setNewAdminEmail('');
  };

  const handleDeleteAdmin = (id: string) => {
    if (adminUsers.length <= 1) return;
    if (confirm("Are you sure?")) {
      const updated = adminUsers.filter(u => u.id !== id);
      setAdminUsers(updated);
      localStorage.setItem('wl_admin_users', JSON.stringify(updated));
    }
  };

  const handleCreateNewButton = () => {
    if (!newButtonName.trim()) return;
    const updated = {
      ...categoryStructure,
      [selectedAdminCategory]: [...(categoryStructure[selectedAdminCategory] || []), newButtonName.trim()]
    };
    setCategoryStructure(updated);
    localStorage.setItem('wl_category_structure', JSON.stringify(updated));
    setNewButtonName('');
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const resourceKey = `${selectedAdminCategory}:${selectedAdminSubCategory}`;
      const title = newDocTitle.trim() || selectedFile.name;
      handleAddResource(resourceKey, title, result);
      setSelectedFile(null);
      setNewDocTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      calculateStorage();
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAddResource = (key: string, name: string, url: string) => {
    const newDoc: ResourceDocument = { id: Date.now().toString(), name, url, timestamp: Date.now() };
    const updated = { ...resources, [key]: [...(resources[key] || []), newDoc] };
    setResources(updated);
    localStorage.setItem('wl_button_resources', JSON.stringify(updated));
  };

  const handleDeleteResource = (key: string, id: string) => {
    const updatedCategoryDocs = (resources[key] || []).filter(d => d.id !== id);
    const updated = { ...resources, [key]: updatedCategoryDocs };
    setResources(updated);
    localStorage.setItem('wl_button_resources', JSON.stringify(updated));
    calculateStorage();
  };

  const handleRenameResource = (key: string, id: string) => {
    const currentDocs = resources[key] || [];
    const doc = currentDocs.find(d => d.id === id);
    if (!doc) return;
    
    const newName = prompt("Enter new title for this document:", doc.name);
    if (newName && newName.trim() && newName !== doc.name) {
      const updatedDocs = currentDocs.map(d => d.id === id ? { ...d, name: newName.trim() } : d);
      const updated = { ...resources, [key]: updatedDocs };
      setResources(updated);
      localStorage.setItem('wl_button_resources', JSON.stringify(updated));
    }
  };

  const handleAsk = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setAnswer('');
    setAudioBlob(null);
    handleStopAudio(); 

    let fullText = '';
    let currentBuffer = '';

    try {
      const stream = getAnswerStream(query, announcements.map(a => a.text));
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullText += chunk.text;
          currentBuffer += chunk.text;
          setAnswer(fullText);
          setIsLoading(false);
        }
      }
      
    } catch (err) {
      console.error("Chat Error:", err);
      setAnswer("I'm sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const playNextInQueue = async () => {
    if (isPlayingQueueRef.current || audioQueueRef.current.length === 0) return;
    isPlayingQueueRef.current = true;
    
    while (audioQueueRef.current.length > 0) {
      const data = audioQueueRef.current.shift();
      if (data) {
        await playBuffer(data);
      }
    }
    isPlayingQueueRef.current = false;
  };

  const handlePlayAudio = async (text: string) => {
    if (!text) return;
    handleStopAudio();
    const blob = await generateSpeech(text);
    if (blob) {
      setAudioBlob(blob);
      playBuffer(blob);
    } else {
      setIsAudioPlaying(true);
      setTimeout(() => setIsAudioPlaying(false), text.length * 80);
    }
  };

  const handleStopAudio = () => {
    audioQueueRef.current = [];
    isPlayingQueueRef.current = false;
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch (e) {}
      audioSourceRef.current = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsAudioPlaying(false);
  };

  const playBuffer = (data: Uint8Array): Promise<void> => {
    return new Promise(async (resolve) => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      
      try {
        const buffer = await decodeAudioBuffer(data, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => { 
          if (audioSourceRef.current === source) setIsAudioPlaying(false); 
          resolve();
        };
        source.start();
        audioSourceRef.current = source;
        setIsAudioPlaying(true);
      } catch (err) { 
        setIsAudioPlaying(false); 
        resolve();
      }
    });
  };

  const handleSubmitChat = (e?: React.FormEvent | string) => {
    if (e && typeof e !== 'string') e.preventDefault();
    const text = typeof e === 'string' ? e : inputText;
    if (text.trim() && !isLoading) {
      handleAsk(text);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitChat();
    }
  };

  const handleViewDocs = (category: string, button: string) => {
    const key = `${category}:${button}`;
    const docs = resources[key] || [];
    if (docs.length === 0) {
      handleAsk(`Tell me about ${button} at Williamsburg Landing`);
    } else if (docs.length === 1) {
      const win = window.open();
      if (win) win.document.write(`<iframe src="${docs[0].url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    } else {
      setViewingDocs({ title: button, docs });
    }
  };

  const handleStaffAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (campusCode.toUpperCase() === BRAND.CAMPUS_CODE) {
      setView(View.MAIN);
      setError('');
    } else {
      setError('Invalid Campus Code. Please try again.');
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const email = adminEmail.trim().toLowerCase();
    const isAdmin = adminUsers.some(u => u.email.toLowerCase() === email);
    
    if (isAdmin && adminPassword === SHARED_ADMIN_PASSWORD) {
      setView(View.ADMIN);
      setError('');
    } else {
      setError('Invalid credentials or unauthorized email.');
    }
  };

  if (view === View.SPLASH) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-bg">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-xl border border-brand-secondary/10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary"></div>
          <img 
            src={BRAND.LOGO_URL} 
            alt="Williamsburg Landing Logo" 
            className="h-20 md:h-24 mb-10 object-contain"
            referrerPolicy="no-referrer"
          />
          
          <div className="flex w-full mb-10 bg-brand-bg p-1 rounded-lg">
            <button 
              onClick={() => { setLoginMode('STAFF'); setError(''); }} 
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all rounded-md ${loginMode === 'STAFF' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:text-brand-primary'}`}
            >
              Resident Login
            </button>
            <button 
              onClick={() => { setLoginMode('ADMIN'); setError(''); }} 
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all rounded-md ${loginMode === 'ADMIN' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:text-brand-primary'}`}
            >
              Admin Login
            </button>
          </div>

          <h2 className="text-3xl md:text-4xl font-display text-center text-brand-primary mb-10">
            {loginMode === 'STAFF' ? 'Resident Portal' : 'Administrator Portal'}
          </h2>

          {loginMode === 'STAFF' ? (
            <form onSubmit={handleStaffAuth} className="w-full space-y-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-brand-secondary">Campus Code</label>
                <input 
                  type="text" 
                  value={campusCode} 
                  onChange={(e) => setCampusCode(e.target.value)} 
                  placeholder="Enter Code" 
                  className="w-full p-5 text-2xl border-2 border-brand-bg rounded-lg focus:border-brand-primary outline-none text-center uppercase tracking-[0.3em] text-brand-primary font-bold bg-brand-bg transition-colors" 
                />
              </div>
              {error && <p className="text-red-600 text-sm text-center font-semibold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
              <button type="submit" className="btn-primary w-full text-lg uppercase tracking-widest">
                Enter Portal
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminAuth} className="w-full space-y-6">
              <input 
                type="email" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)} 
                placeholder="Authorized Email Address" 
                className="w-full p-5 text-lg border-2 border-brand-bg rounded-lg focus:border-brand-primary outline-none text-brand-primary font-semibold bg-brand-bg transition-colors" 
              />
              <input 
                type="password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                placeholder="Group Login Code" 
                className="w-full p-5 text-lg border-2 border-brand-bg rounded-lg focus:border-brand-primary outline-none text-brand-primary font-semibold bg-brand-bg transition-colors" 
              />
              {error && <p className="text-red-600 text-sm text-center font-semibold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
              <button type="submit" className="btn-primary w-full text-lg uppercase tracking-widest">
                Login
              </button>
            </form>
          )}
          
          <p className="mt-12 text-xs text-brand-text-muted text-center leading-relaxed font-medium">
            Williamsburg Landing is a premier senior living community<br />
            dedicated to providing a gracious lifestyle and exceptional care.
          </p>
        </div>
      </div>
    );
  }

  if (view === View.ADMIN) {
    return (
      <Layout showHeader onAdminClick={() => setView(View.MAIN)}>
        <div className="flex flex-col space-y-10 animate-in fade-in duration-300 max-w-6xl mx-auto w-full pb-20 px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-brand-gold pb-6">
            <h2 className="text-4xl font-display text-brand-primary">Admin Dashboard</h2>
            <button onClick={() => setView(View.MAIN)} className="btn-secondary text-sm">← Exit Dashboard</button>
          </div>

          <div className="flex bg-white p-2 rounded-lg gap-2 shadow-sm overflow-x-auto no-scrollbar border border-brand-secondary/10">
            {['COMMUNITY', 'DOCUMENTS', 'DIRECTORY', 'SYSTEM'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setAdminActiveTab(tab as any)} 
                className={`flex-1 min-w-[120px] py-3 text-xs font-bold uppercase tracking-[0.12em] rounded-md transition-all ${adminActiveTab === tab ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:bg-brand-bg'}`}
              >
                {tab === 'COMMUNITY' ? 'Announcements' : tab === 'DOCUMENTS' ? 'Documents' : tab === 'DIRECTORY' ? 'Directory' : 'System'}
              </button>
            ))}
          </div>

          {adminActiveTab === 'COMMUNITY' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <section className="card p-8">
                <h3 className="text-2xl font-display mb-6 text-brand-primary">Daily Announcements</h3>
                <div className="flex gap-4 mb-8">
                  <input id="ann-inp" type="text" placeholder="Type new announcement..." className="flex-1 p-4 border-2 border-brand-bg rounded-lg outline-none focus:border-brand-primary bg-brand-bg" />
                  <button onClick={handleAddAnnouncement} className="btn-primary">Post</button>
                </div>
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="flex justify-between items-center p-4 bg-brand-bg rounded-lg border border-brand-secondary/5">
                      <p className="text-brand-text font-medium">{ann.text}</p>
                      <button onClick={() => {
                        const updated = announcements.filter(a => a.id !== ann.id);
                        setAnnouncements(updated);
                        localStorage.setItem('wl_announcements', JSON.stringify(updated));
                      }} className="text-red-600 text-xs font-bold uppercase tracking-wider hover:underline">Remove</button>
                    </div>
                  ))}
                  {announcements.length === 0 && <p className="text-center text-brand-text-muted italic py-8">No active announcements.</p>}
                </div>
              </section>
            </div>
          )}

          {adminActiveTab === 'DOCUMENTS' && (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
               <section className="card p-8">
                 <h3 className="text-2xl font-display mb-6 text-brand-primary">Portal Button Content</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>
                      <label className="section-label mb-2 block">1. Select App Category</label>
                      <select value={selectedAdminCategory} onChange={(e) => { setSelectedAdminCategory(e.target.value); setSelectedAdminSubCategory(categoryStructure[e.target.value][0]); }} className="w-full p-4 border-2 border-brand-bg rounded-lg bg-brand-bg outline-none focus:border-brand-primary text-brand-primary font-semibold">
                        {Object.keys(categoryStructure).map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="section-label mb-2 block">2. Select Specific Button</label>
                      <select value={selectedAdminSubCategory} onChange={(e) => setSelectedAdminSubCategory(e.target.value)} className="w-full p-4 border-2 border-brand-bg rounded-lg bg-brand-bg outline-none focus:border-brand-primary text-brand-primary font-semibold">
                        {(categoryStructure[selectedAdminCategory] || []).map(sub => <option key={sub}>{sub}</option>)}
                      </select>
                    </div>
                 </div>

                 <div className="bg-brand-bg p-8 rounded-lg border-2 border-dashed border-brand-secondary/20 mb-10">
                   <h4 className="text-lg font-bold text-brand-primary mb-6">Upload Document for "{selectedAdminSubCategory}"</h4>
                   <div className="space-y-4 mb-6">
                     <label className="section-label">Document Title (e.g. February Calendar)</label>
                     <input 
                       type="text" 
                       value={newDocTitle} 
                       onChange={(e) => setNewDocTitle(e.target.value)} 
                       placeholder="Enter a title for this document..." 
                       className="w-full p-4 border-2 border-white rounded-lg outline-none focus:border-brand-primary bg-white"
                     />
                   </div>
                   <div className="flex flex-col md:flex-row gap-6">
                     <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="flex-1 p-4 bg-white rounded-lg border border-brand-secondary/10 text-sm" />
                     <button onClick={handleFileUpload} disabled={!selectedFile} className="btn-primary disabled:opacity-50">Upload to Portal</button>
                   </div>
                   <p className="mt-4 text-xs text-brand-text-muted italic">Supports PDF and Images. Will be stored in browser cache.</p>
                 </div>

                 <div className="space-y-3">
                   <h4 className="section-label mb-4">Current Files:</h4>
                   {(resources[`${selectedAdminCategory}:${selectedAdminSubCategory}`] || []).map(doc => (
                     <div key={doc.id} className="bg-white p-4 rounded-lg border border-brand-secondary/10 flex justify-between items-center shadow-sm">
                        <span className="font-semibold text-brand-primary">{doc.name}</span>
                        <div className="flex gap-4">
                          <button onClick={() => handleRenameResource(`${selectedAdminCategory}:${selectedAdminSubCategory}`, doc.id)} className="text-brand-gold text-xs font-bold uppercase tracking-wider hover:underline">Rename</button>
                          <button onClick={() => handleDeleteResource(`${selectedAdminCategory}:${selectedAdminSubCategory}`, doc.id)} className="text-red-600 text-xs font-bold uppercase tracking-wider hover:underline">Delete</button>
                        </div>
                     </div>
                   ))}
                   {(resources[`${selectedAdminCategory}:${selectedAdminSubCategory}`] || []).length === 0 && <p className="text-brand-text-muted italic text-sm">No files uploaded yet.</p>}
                 </div>
               </section>
            </div>
          )}

          {adminActiveTab === 'DIRECTORY' && (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
               <section className="card p-8">
                  <h3 className="text-2xl font-display mb-6 text-brand-primary">Master Spreadsheet Connection</h3>
                  <div className="bg-brand-bg p-8 rounded-lg mb-10 border border-brand-secondary/10">
                    <h4 className="text-lg font-bold text-brand-primary mb-2">Google Sheet Public Link</h4>
                    <p className="text-brand-text-muted mb-6 text-sm leading-relaxed italic">The Master Directory button on the resident's phone book will open this link. Use a Public Google Sheet to replace the old PDF.</p>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input type="text" value={buttonLinks.directorySheet || ''} onChange={(e) => handleUpdateLink('directorySheet', e.target.value)} className="flex-1 p-4 border-2 border-white rounded-lg outline-none focus:border-brand-primary bg-white shadow-sm" placeholder="https://docs.google.com/spreadsheets/d/..." />
                      <button onClick={() => alert("Link Saved.")} className="btn-primary">Save Link</button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-display mb-6 text-brand-primary">On-Screen Staff Search</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-brand-bg p-8 rounded-lg border border-brand-secondary/10">
                      <h4 className="text-lg font-bold text-brand-primary mb-6">Add New Listing</h4>
                      <div className="space-y-4">
                        <select value={newContact.category} onChange={(e) => setNewContact({...newContact, category: e.target.value as any})} className="w-full p-4 border-2 border-white rounded-lg bg-white text-brand-primary font-semibold"><option>Resident</option><option>Staff</option></select>
                        <input type="text" placeholder="Full Name (Required)" value={newContact.name || ''} onChange={(e) => setNewContact({...newContact, name: e.target.value})} className="w-full p-4 border-2 border-white rounded-lg bg-white" />
                        <input type="text" placeholder="Phone Number (Required)" value={newContact.phone || ''} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} className="w-full p-4 border-2 border-white rounded-lg bg-white" />
                        <input type="text" placeholder="Building / Neighborhood / Dept" value={newContact.info || ''} onChange={(e) => setNewContact({...newContact, info: e.target.value})} className="w-full p-4 border-2 border-white rounded-lg bg-white" />
                        <input type="text" placeholder="Residence Address" value={newContact.address || ''} onChange={(e) => setNewContact({...newContact, address: e.target.value})} className="w-full p-4 border-2 border-white rounded-lg bg-white" />
                        <button onClick={handleAddContact} className="btn-primary w-full mt-4">Add to Live Directory</button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="section-label">Current List ({contacts.length})</h4>
                        <button onClick={() => { if(confirm("This will reload the base directory data, removing any custom additions. Continue?")) { localStorage.removeItem('wl_contacts'); loadAllData(); } }} className="text-brand-gold font-bold text-xs hover:underline uppercase tracking-wider">Reset to Base Data</button>
                      </div>
                      {contacts.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-lg border border-brand-secondary/10 flex justify-between items-center shadow-sm">
                          <div>
                            <p className="font-bold text-brand-primary leading-tight">{c.name}</p>
                            <p className="text-xs font-semibold text-brand-gold italic">{c.info}</p>
                          </div>
                          <button onClick={() => handleDeleteContact(c.id)} className="text-red-600 text-xs font-bold uppercase tracking-wider hover:underline">Delete</button>
                        </div>
                      ))}
                    </div>
                  </div>
               </section>
            </div>
          )}

          {adminActiveTab === 'SYSTEM' && (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
               <section className="card p-8">
                 <h3 className="text-2xl font-display mb-6 text-brand-primary">Storage & Backup</h3>
                 <div className="bg-brand-bg p-8 rounded-lg mb-10 border border-brand-secondary/10">
                    <div className="flex justify-between mb-2"><span className="section-label">Storage Usage</span><span className="font-bold text-brand-primary">{storageUsage.toFixed(1)}%</span></div>
                    <div className="w-full bg-white rounded-full h-3 border border-brand-secondary/10"><div className="bg-brand-gold h-full rounded-full transition-all" style={{ width: `${storageUsage}%` }}></div></div>
                    <p className="mt-4 text-xs text-brand-text-muted leading-relaxed">The portal uses browser local storage (max 5MB). High-resolution images or large PDFs will fill this quickly. Use cloud-hosted links for large files where possible.</p>
                 </div>
                 <div className="flex flex-col md:flex-row gap-6">
                    <button onClick={handleExportData} className="flex-1 btn-primary uppercase tracking-widest text-sm">📥 Export Backup</button>
                    <label className="flex-1 btn-secondary text-center cursor-pointer uppercase tracking-widest text-sm">📤 Import Backup<input type="file" onChange={handleImportData} className="hidden" accept=".json" /></label>
                 </div>
               </section>

               <section className="card p-8">
                  <h3 className="text-2xl font-display mb-6 text-brand-primary">Administrator Access</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="New admin email..." className="flex-1 p-4 border-2 border-brand-bg rounded-lg outline-none focus:border-brand-primary bg-brand-bg" />
                      <button onClick={handleAddAdmin} className="btn-primary">Add Admin</button>
                    </div>
                    <div className="space-y-3">
                      {adminUsers.map(admin => (
                        <div key={admin.id} className="bg-brand-bg p-4 rounded-lg border border-brand-secondary/5 flex justify-between items-center">
                          <span className="font-semibold text-brand-primary">{admin.email}</span>
                          <button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-600 text-xs font-bold uppercase tracking-wider hover:underline">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
               </section>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  const renderViewContent = () => {
    switch (view) {
      case View.MAIN:
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
             <section className="card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <img src={BRAND.LOGO_URL} alt="" className="h-24 grayscale" />
                </div>
                <div className="relative z-10">
                  <p className="section-label mb-2">Community Updates</p>
                  <h2 className="text-3xl font-display text-brand-primary mb-6">Daily Announcements</h2>
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="flex items-start gap-4 p-4 bg-brand-bg rounded-lg border-l-4 border-brand-primary">
                        <span className="text-brand-gold mt-1">✦</span>
                        <p className="text-brand-text font-medium leading-relaxed">{ann.text}</p>
                      </div>
                    ))}
                    {announcements.length === 0 && <p className="text-brand-text-muted italic">No announcements at this time.</p>}
                  </div>
                </div>
             </section>

             <section>
               <div className="flex items-center gap-4 mb-8">
                 <div className="h-px flex-1 bg-brand-secondary/20"></div>
                 <h2 className="text-3xl md:text-5xl font-display leading-tight font-bold text-brand-primary whitespace-nowrap">Explore Your Community</h2>
                 <div className="h-px flex-1 bg-brand-secondary/20"></div>
               </div>
               <TopicButtons 
                 onTopicClick={(topic) => { setInputText(topic); handleSubmitChat(topic); }}
                 onDirectoryClick={() => setView(View.DIRECTORY)}
                 onMenusClick={() => setView(View.MENUS)}
                 onRequestFormsClick={() => setView(View.REQUEST_FORMS)}
                 onCampusInfoClick={() => setView(View.CAMPUS_INFO)}
                 onEventCalendarClick={() => handleViewDocs('Campus Information', 'Event Calendar')}
                 links={buttonLinks}
               />
             </section>

             <section className="bg-brand-primary rounded-xl p-8 md:p-16 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/williamsburg/1200/800')] opacity-10 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-5xl font-display leading-tight font-bold text-white">How can we assist you today?</h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light">Ask about dining hours, campus events, or community services.</p>
                  </div>
                  
                  <div className="w-full max-w-2xl relative">
                    <textarea
                      ref={textareaRef}
                      rows={2}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your question here..."
                      className="w-full p-6 pr-20 rounded-2xl bg-white text-brand-primary text-lg md:text-xl shadow-2xl outline-none focus:ring-4 ring-brand-gold/30 transition-all placeholder:text-gray-400 resize-none font-semibold"
                    />
                    <button 
                      onClick={() => handleSubmitChat()}
                      disabled={isLoading || !inputText.trim()}
                      className="absolute right-4 bottom-4 bg-brand-gold text-white p-4 rounded-xl font-bold hover:brightness-110 transition-all active:scale-95 shadow-md disabled:opacity-50"
                    >
                      {isLoading ? <span className="animate-pulse text-2xl">⏳</span> : <span className="text-2xl">➔</span>}
                    </button>
                  </div>

                  {answer && (
                    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500 text-left">
                      <p className="text-xl md:text-2xl font-medium leading-relaxed text-white">{answer}</p>
                      <div className="mt-8 flex flex-wrap gap-4">
                         <button 
                           onClick={() => handlePlayAudio(answer)} 
                           className="flex-1 bg-brand-gold text-white px-6 py-3 rounded-lg font-bold hover:brightness-110 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                         >
                           {isAudioPlaying ? '🔄 Play Again' : '🔊 Listen to Answer'}
                         </button>
                         <button 
                           onClick={handleStopAudio} 
                           className="px-6 py-3 rounded-lg font-bold text-white/70 hover:text-white transition-all"
                         >
                           Stop
                         </button>
                      </div>
                    </div>
                  )}
                </div>
             </section>
          </div>
        );
      case View.DIRECTORY:
        return <Directory onBack={() => setView(View.MAIN)} data={RESIDENT_DATA as any} sheetUrl={buttonLinks.directorySheet} />;
      case View.MENUS:
        return <Menus onBack={() => setView(View.MAIN)} customItems={categoryStructure['Menus']} onSelectCustom={(btn) => handleViewDocs('Menus', btn)} />;
      case View.REQUEST_FORMS:
        return <RequestForms onBack={() => setView(View.MAIN)} customItems={categoryStructure['Request Forms']} onSelectCustom={(btn) => handleViewDocs('Request Forms', btn)} />;
      case View.CAMPUS_INFO:
        return <CampusInfo onBack={() => setView(View.MAIN)} onSelectTopic={handleAsk} onDoigClick={() => setView(View.DOIG_HEALTH_CLUB)} customItems={categoryStructure['Campus Information']} onSelectCustom={(btn) => handleViewDocs('Campus Information', btn)} />;
      case View.DOIG_HEALTH_CLUB:
        return <DoigHealthClub onBack={() => setView(View.CAMPUS_INFO)} />;
      default:
        return null;
    }
  };

  return (
    <Layout showHeader onAdminClick={() => { setLoginMode('ADMIN'); setView(View.SPLASH); }}>
      {renderViewContent()}
      
      {viewingDocs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-t-4 border-brand-gold">
            <div className="bg-white p-8 border-b border-brand-bg flex justify-between items-center">
              <div>
                <p className="section-label mb-1">Community Resources</p>
                <h2 className="text-3xl font-display text-brand-primary">{viewingDocs.title}</h2>
              </div>
              <button onClick={() => setViewingDocs(null)} className="text-brand-text-muted hover:text-brand-primary transition-colors p-2">
                <span className="text-2xl">✕</span>
              </button>
            </div>
            <div className="p-8 space-y-4 overflow-y-auto bg-brand-bg/30">
              {viewingDocs.docs.map(doc => (
                <button key={doc.id} onClick={() => window.open(doc.url, '_blank')} className="w-full text-left p-6 bg-white hover:bg-brand-bg rounded-xl shadow-sm border border-brand-secondary/10 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-bg rounded-lg flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      📄
                    </div>
                    <span className="text-lg font-semibold text-brand-text group-hover:text-brand-primary">{doc.name}</span>
                  </div>
                  <span className="text-brand-gold font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                </button>
              ))}
              {viewingDocs.docs.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-brand-text-muted italic">No documents available for this resource at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
