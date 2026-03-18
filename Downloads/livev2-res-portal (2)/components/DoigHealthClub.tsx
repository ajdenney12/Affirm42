
import React, { useState } from 'react';

interface DoigHealthClubProps {
  onBack: () => void;
}

const DoigHealthClub: React.FC<DoigHealthClubProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'LAND' | 'AQUATIC'>('LAND');

  const landClasses = [
    { name: 'Balance Basics', desc: 'Focus on improving balance, gait and mobility. (30 Mins)' },
    { name: 'Beginner Yoga', desc: 'Improves flexibility and relaxation. Suitable for beginners. (60 Mins)' },
    { name: 'Zumba/Cardio Dance', desc: 'Multiple styles of low impact dances. (40 Mins)' },
    { name: 'Mobility in Motion', desc: 'Maintains and improves everyday functional movements. (45 Mins)' },
    { name: 'Staying Strong', desc: 'Lively total body workout with weights and floor work. (45 Mins)' },
    { name: 'Strength & Stretch', desc: 'Strengthen every muscle using weights and bands. (40 Mins)' },
    { name: 'Tai Chi', desc: 'Gentle Sun-style routines suitable for every fitness level. (60 Mins)' },
    { name: 'Yoga Fusion', desc: 'Builds strength and endurance of core postural muscles. (60 Mins)' },
    { name: 'Pilates', desc: 'Focuses on building core strength and flexibility. (45 Mins)' }
  ];

  const aquaticClasses = [
    { name: 'Aquacise', desc: 'Cardiovascular and strength workout in water. (45 Mins)' },
    { name: 'Aqua Zumba', desc: 'Workout using low and deep ends of the pool. (45 Mins)' },
    { name: 'Deep Water', desc: 'Flotation belts and noodles for cardiovascular fitness. (45 Mins)' },
    { name: 'H2O Cardio', desc: 'Uses water dumbbells, noodles and paddles. (60 Mins)' },
    { name: 'H20 Flex', desc: 'Low impact aquatic exercise using the entire pool. (45 Mins)' },
    { name: 'Aqua Tabata', desc: 'High-intensity interval training in water. (30 Mins)' },
    { name: 'Family Swim', desc: 'Sundays from 1 to 3:45 PM. Guests must sign waiver.' }
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Doig Health Club & Spa Schedule</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #00385d; }
            h1 { border-bottom: 4px solid #00385d; padding-bottom: 10px; }
            h2 { color: #4a7da4; margin-top: 30px; border-bottom: 2px solid #ccc; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: center; vertical-align: top; }
            th { background: #f4f4f4; font-weight: bold; }
            .class-name { font-weight: bold; }
            .class-time { font-size: 0.9em; color: #555; }
            .desc-list { margin-top: 30px; }
            .desc-item { margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 5px; }
            .footer { margin-top: 40px; font-style: italic; font-size: 0.8em; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <center>
            <h1>William A. Doig Health Club & Spa</h1>
            <p><strong>January 2026 Schedule</strong> | Phone: (757) 565-6545</p>
          </center>

          <h2>Land Based Exercise Classes</h2>
          <table>
            <tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr>
            <tr>
              <td>8:30-9:15<br/>Staying Strong</td>
              <td>8:30-9:40<br/>Yoga</td>
              <td>8:30-9:15<br/>Staying Strong</td>
              <td>8:30-9:40<br/>Yoga</td>
              <td>-</td>
            </tr>
            <tr>
              <td>9:30-10:15<br/>Zumba Dance</td>
              <td>9:45-10:30<br/>Strength & Stretch</td>
              <td>9:15-9:45<br/>Core Pilates</td>
              <td>9:45-10:25<br/>Strength & Stretch</td>
              <td>9:30-10:15<br/>Pilates</td>
            </tr>
            <tr>
              <td>-</td>
              <td>10:30-11:15<br/>Cardio Dance</td>
              <td>10:00-11:00<br/>Tai Chi</td>
              <td>10:25-11:05<br/>Cardio Dance</td>
              <td>11:00-12:00<br/>Beginner Yoga</td>
            </tr>
            <tr>
              <td>11:15-12:00<br/>Mobility in Motion</td>
              <td>2:00-2:30<br/>Balance Basics</td>
              <td>11:15-12:00<br/>Mobility in Motion</td>
              <td>2:00-2:30<br/>Balance Basics</td>
              <td>1:15-2:00<br/>Mobility in Motion</td>
            </tr>
          </table>

          <h2>Aquatic Exercise Classes</h2>
          <table>
            <tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th></tr>
            <tr>
              <td>7:30-8:30<br/>H2O Cardio</td>
              <td>-</td>
              <td>7:30-8:30<br/>H2O Cardio</td>
              <td>-</td>
              <td>7:30-8:30<br/>H2O Cardio</td>
            </tr>
            <tr>
              <td>8:35-9:20<br/>Aqua Zumba</td>
              <td>9:15-10:00<br/>Aquacise</td>
              <td>8:35-9:20<br/>Aqua Zumba</td>
              <td>9:15-10:00<br/>Aquacise</td>
              <td>-</td>
            </tr>
            <tr>
              <td>10:15-11:00<br/>H2O Flex</td>
              <td>10:15-11:00<br/>Aquacise</td>
              <td>10:15-11:00<br/>H2O Flex</td>
              <td>10:15-11:00<br/>Aquacise</td>
              <td>11:15-12:00<br/>Deep Water</td>
            </tr>
          </table>

          <div class="footer">
            Health Club Hours: Mon-Fri 6AM-6PM | Sat 7AM-3PM | Sun 12PM-4PM
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-brand-gold pb-6">
        <div>
          <p className="section-label mb-1">Wellness & Fitness</p>
          <h2 className="text-4xl font-display text-brand-primary">Doig Health Club & Spa</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="btn-primary text-sm flex items-center gap-2"
          >
            🖨️ Print Schedule
          </button>
          <button 
            onClick={onBack}
            className="btn-secondary text-sm"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white p-2 rounded-lg gap-2 shadow-sm border border-brand-secondary/10">
        <button 
          onClick={() => setActiveTab('LAND')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.12em] rounded-md transition-all ${activeTab === 'LAND' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:bg-brand-bg'}`}
        >
          Land Classes
        </button>
        <button 
          onClick={() => setActiveTab('AQUATIC')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.12em] rounded-md transition-all ${activeTab === 'AQUATIC' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:bg-brand-bg'}`}
        >
          Aquatic Classes
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule Preview Section */}
        <section className="card p-8 border-t-4 border-brand-primary">
          <h3 className="text-2xl font-display mb-8 text-brand-primary flex items-center gap-3">
            Weekly Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-bg">
                  <th className="py-4 section-label">Day</th>
                  <th className="py-4 section-label">Morning</th>
                  <th className="py-4 section-label">Mid-Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-bg">
                {activeTab === 'LAND' ? (
                  <>
                    <tr><td className="py-4 font-bold text-brand-primary">Mon</td><td className="text-brand-text">8:30 Staying Strong</td><td className="text-brand-text">11:15 Mobility</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Tue</td><td className="text-brand-text">8:30 Yoga</td><td className="text-brand-text">9:45 Strength</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Wed</td><td className="text-brand-text">8:30 Staying Strong</td><td className="text-brand-text">10:00 Tai Chi</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Thu</td><td className="text-brand-text">8:30 Yoga</td><td className="text-brand-text">10:25 Cardio</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Fri</td><td className="text-brand-text">9:30 Pilates</td><td className="text-brand-text">11:00 Beginner Yoga</td></tr>
                  </>
                ) : (
                  <>
                    <tr><td className="py-4 font-bold text-brand-primary">Mon</td><td className="text-brand-text">7:30 H2O Cardio</td><td className="text-brand-text">10:15 H2O Flex</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Tue</td><td className="text-brand-text">9:15 Aquacise</td><td className="text-brand-text">11:30 Aqua Tabata</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Wed</td><td className="text-brand-text">7:30 H2O Cardio</td><td className="text-brand-text">10:15 H2O Flex</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Thu</td><td className="text-brand-text">9:15 Aquacise</td><td className="text-brand-text">11:30 Aqua Tabata</td></tr>
                    <tr><td className="py-4 font-bold text-brand-primary">Fri</td><td className="text-brand-text">7:30 H2O Cardio</td><td className="text-brand-text">11:15 Deep Water</td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-brand-text-muted italic">* Full detailed schedule available via the Print button.</p>
        </section>

        {/* Descriptions Section */}
        <section className="card p-8 border-t-4 border-brand-gold">
          <h3 className="text-2xl font-display mb-8 text-brand-primary flex items-center gap-3">
            Class Descriptions
          </h3>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            {(activeTab === 'LAND' ? landClasses : aquaticClasses).map((c, i) => (
              <div key={i} className="bg-brand-bg p-6 rounded-lg border-l-4 border-brand-primary">
                <h4 className="text-lg font-bold text-brand-primary mb-1">{c.name}</h4>
                <p className="text-brand-text-muted font-medium leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Info Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-bg p-8 rounded-xl border border-brand-secondary/10 flex items-center gap-6">
          <div className="text-4xl">⏰</div>
          <div>
            <h4 className="text-lg font-bold text-brand-primary">Health Club Hours</h4>
            <p className="text-brand-text font-medium">Mon-Fri: 6 AM - 6 PM</p>
            <p className="text-brand-text font-medium">Sat: 7 AM - 3 PM | Sun: 12 PM - 4 PM</p>
          </div>
        </div>
        <div className="bg-brand-bg p-8 rounded-xl border border-brand-secondary/10 flex items-center gap-6">
          <div className="text-4xl">📞</div>
          <div>
            <h4 className="text-lg font-bold text-brand-primary">Contact Wellness</h4>
            <p className="text-brand-text font-medium">Telephone: (757) 565-6545</p>
            <p className="text-brand-text font-medium">Located in Land Based Wellness Center</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoigHealthClub;
