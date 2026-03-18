
import React, { useState } from 'react';
import { BRAND } from '../constants';

interface CampusInfoProps {
  onBack: () => void;
  onSelectTopic: (topic: string) => void;
  onDoigClick: () => void;
  onSelectCustom: (buttonName: string) => void;
  customItems?: string[];
}

const CampusInfo: React.FC<CampusInfoProps> = ({ 
  onBack, 
  onSelectTopic, 
  onDoigClick, 
  onSelectCustom,
  customItems = [] 
}) => {
  const [currentCategory, setCurrentCategory] = useState<'MAIN' | 'VIDEOS'>('MAIN');

  // These are the buttons that have special hardcoded logic or icons
  const specialButtons: Record<string, { icon: string, desc: string, action: () => void }> = {
    'Video Recordings': {
      icon: '🎥',
      desc: 'Access recordings of staff meetings, training programs, and educational sessions.',
      action: () => setCurrentCategory('VIDEOS')
    },
    'IL Clinic': {
      icon: '🏥',
      desc: 'Independent Living Clinic information, hours, and contact details.',
      action: () => onSelectTopic('Tell me about IL Clinic at Williamsburg Landing')
    },
    'Doig Health Club & Spa': {
      icon: '🏊',
      desc: 'Wellness center, pool hours, and fitness class schedules (January 2026).',
      action: onDoigClick
    },
    'Maps': {
      icon: '🗺️',
      desc: 'Campus maps and building directories to help you find your way.',
      action: () => onSelectTopic('Tell me about Maps at Williamsburg Landing')
    },
    'Recycling': {
      icon: '♻️',
      desc: 'Guidelines for recycling pickup and campus sustainability efforts.',
      action: () => onSelectTopic('Tell me about Recycling at Williamsburg Landing')
    },
    'Staff Committee': {
      icon: '🤝',
      desc: 'Learn about your staff representatives and community meetings.',
      action: () => onSelectTopic('Tell me about Staff Committee at Williamsburg Landing')
    },
    'Flea Market': {
      icon: '🛍️',
      desc: 'Information about the campus flea market schedules and donations.',
      action: () => onSelectTopic('Tell me about Flea Market at Williamsburg Landing')
    },
    'Event Calendar': {
      icon: '📅',
      desc: 'View the monthly event calendars and community schedules.',
      action: () => onSelectCustom('Event Calendar')
    }
  };

  const videoItems = [
    {
      name: 'Staff Meetings & Program Recordings',
      icon: '📅',
      description: 'Catch up on recent community meetings and social programs.',
      action: () => onSelectCustom('Staff Meetings & Program Recordings')
    },
    {
      name: 'Staff Training Recordings',
      icon: '🎓',
      description: 'Watch recorded lectures and educational presentations.',
      action: () => onSelectCustom('Staff Training Recordings')
    }
  ];

  // Merge dynamic buttons with special buttons
  const mainItems = customItems
    .filter(name => name !== 'Staff Meetings & Program Recordings' && name !== 'Staff Training Recordings')
    .map(name => {
      if (specialButtons[name]) {
        return {
          name,
          icon: specialButtons[name].icon,
          description: specialButtons[name].desc,
          action: specialButtons[name].action
        };
      }
      return {
        name,
        icon: '📄',
        description: 'Assigned document resources for ' + name,
        action: () => onSelectCustom(name)
      };
    });

  const isVideos = currentCategory === 'VIDEOS';
  const displayItems = isVideos ? videoItems : mainItems;

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-brand-gold pb-6">
        <div>
          <p className="section-label mb-1">Campus Resources</p>
          <h2 className="text-4xl font-display text-brand-primary">
            {isVideos ? 'Video Recordings' : 'Campus Information'}
          </h2>
        </div>
        <button 
          onClick={isVideos ? () => setCurrentCategory('MAIN') : onBack}
          className="btn-secondary text-sm"
        >
          {isVideos ? '← Back' : '← Back to Portal'}
        </button>
      </div>

      <div className="grid gap-6">
        {displayItems.map((item, idx) => (
          <button 
            key={idx}
            onClick={item.action}
            className="card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-l-8 border-brand-primary text-left group hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-6 flex-1">
              <span className="text-4xl bg-brand-bg p-4 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">{item.icon}</span>
              <div>
                <h3 className="text-2xl font-display text-brand-primary group-hover:text-brand-secondary transition-colors">{item.name}</h3>
                <p className="text-brand-text-muted font-medium mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
            <div className="w-full md:w-auto btn-primary text-sm whitespace-nowrap">
              {isVideos ? 'View Category' : 'Open'}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-brand-bg p-8 rounded-xl border border-brand-secondary/10">
        <p className="text-lg font-medium text-brand-primary text-center leading-relaxed italic">
          Looking for something else? You can ask the assistant on the home screen for specific details.
        </p>
      </div>
    </div>
  );
};

export default CampusInfo;
