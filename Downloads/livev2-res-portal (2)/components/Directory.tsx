
import React, { useState } from 'react';
import { Contact } from '../src/types';

interface DirectoryProps {
  onBack: () => void;
  data: Contact[];
  sheetUrl?: string;
}

const Directory: React.FC<DirectoryProps> = ({ onBack, data, sheetUrl }) => {
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filtered = data.filter((contact: any) => {
    const s = search.toLowerCase();
    return (
      (contact.name?.toLowerCase().includes(s)) ||
      (contact.info?.toLowerCase().includes(s)) ||
      (contact.role?.toLowerCase().includes(s)) ||
      (contact.category?.toLowerCase().includes(s)) ||
      (contact.extension?.toLowerCase().includes(s)) ||
      (contact.firstName?.toLowerCase().includes(s)) ||
      (contact.lastName?.toLowerCase().includes(s))
    );
  });

  return (
    <div className="relative">
      <div className="card p-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <p className="section-label mb-1">Campus Resources</p>
            <h2 className="text-4xl font-display text-brand-primary">Campus Directory</h2>
          </div>
          <button 
            onClick={onBack}
            className="btn-secondary text-sm"
          >
            ← Back to Portal
          </button>
        </div>

        {sheetUrl && (
          <button 
            onClick={() => window.open(sheetUrl, '_blank')}
            className="w-full bg-brand-primary text-white p-8 rounded-xl mb-10 shadow-md flex items-center justify-center gap-6 hover:brightness-110 transition-all group active:scale-[0.99]"
          >
            <span className="text-5xl group-hover:scale-110 transition-transform">📊</span>
            <div className="text-left">
              <p className="text-xl font-bold uppercase tracking-[0.12em] leading-none mb-2">Master Spreadsheet</p>
              <p className="text-white/70 font-light">Click to open full live Google Sheets document</p>
            </div>
          </button>
        )}

        <div className="mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search names, departments, or buildings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-5 text-lg border-2 border-brand-bg rounded-xl outline-none focus:border-brand-primary bg-brand-bg transition-colors"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl opacity-30">🔍</span>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map((contact, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedContact(contact)}
              className={`w-full text-left p-6 rounded-xl border border-brand-secondary/10 shadow-sm flex justify-between items-center transition-all hover:border-brand-gold hover:shadow-md active:scale-[0.99] ${
                contact.category === 'Staff' 
                  ? 'bg-brand-bg/50' 
                  : 'bg-white'
              }`}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded tracking-[0.12em] ${
                    contact.category === 'Staff' ? 'bg-brand-primary text-white' : 'bg-brand-gold text-white'
                  }`}>
                    {contact.category}
                  </span>
                  <p className="text-xl font-bold text-brand-primary leading-tight">{contact.name}</p>
                </div>
                <p className="text-brand-text-muted font-medium italic">{contact.info}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-brand-primary whitespace-nowrap">
                  {contact.phone}
                </p>
                <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.12em] mt-1">View Details →</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-brand-bg rounded-xl border-2 border-dashed border-brand-secondary/20">
              <p className="text-brand-text-muted italic text-xl mb-2">No matches for "{search}"</p>
              <p className="text-brand-text-muted text-sm">Try searching by building or name.</p>
            </div>
          )}
        </div>
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-t-4 border-brand-gold">
            <div className="bg-white p-8 border-b border-brand-bg flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-brand-bg text-brand-secondary px-3 py-1 rounded-full mb-4 inline-block">
                  {selectedContact.category} Information
                </span>
                <h2 className="text-4xl font-display text-brand-primary leading-tight">
                  {selectedContact.name}
                </h2>
                <p className="text-xl text-brand-text-muted italic mt-2 font-medium">{selectedContact.info}</p>
              </div>
              <button 
                onClick={() => setSelectedContact(null)}
                className="text-brand-text-muted hover:text-brand-primary transition-colors p-2"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto bg-brand-bg/30">
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="bg-brand-primary text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm">📞</div>
                  <div className="flex-1">
                    <p className="section-label mb-1">Primary Number</p>
                    <p className="text-3xl font-bold text-brand-primary tracking-tight">
                      {selectedContact.phone}
                    </p>
                  </div>
                </div>
                {selectedContact.secondaryPhone && (
                  <div className="flex items-start gap-6">
                    <div className="w-12"></div>
                    <div className="flex-1">
                      <p className="section-label mb-1">Secondary Number</p>
                      <p className="text-2xl font-semibold text-brand-text tracking-tight">
                        {selectedContact.secondaryPhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedContact.address && (
                <div className="flex items-start gap-6">
                  <div className="bg-brand-gold text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm">🏠</div>
                  <div className="flex-1">
                    <p className="section-label mb-1">Residence Address</p>
                    <p className="text-xl font-semibold text-brand-text leading-snug">
                      {selectedContact.address}
                    </p>
                  </div>
                </div>
              )}

              {selectedContact.email && (
                <div className="flex items-start gap-6">
                  <div className="bg-brand-bg text-brand-primary w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm">✉️</div>
                  <div className="flex-1 break-all">
                    <p className="section-label mb-1">Email Address</p>
                    <p className="text-xl font-semibold text-brand-primary underline underline-offset-4 decoration-brand-gold/50">
                      {selectedContact.email}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-white border-t border-brand-bg">
              <button 
                onClick={() => setSelectedContact(null)}
                className="btn-primary w-full uppercase tracking-widest text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;
