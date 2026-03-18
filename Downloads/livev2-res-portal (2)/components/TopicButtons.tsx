
import React from 'react';
import { ButtonLinks } from '../src/types';

interface TopicButtonsProps {
  onTopicClick: (topic: string) => void;
  onDirectoryClick: () => void;
  onMenusClick: () => void;
  onRequestFormsClick: () => void;
  onCampusInfoClick: () => void;
  onEventCalendarClick: () => void;
  links: ButtonLinks;
}

const TopicButtons: React.FC<TopicButtonsProps> = ({ 
  onTopicClick, 
  onDirectoryClick, 
  onMenusClick, 
  onRequestFormsClick, 
  onCampusInfoClick,
  onEventCalendarClick,
  links 
}) => {
  const topics = [
    { name: 'Directory', icon: '📞', action: onDirectoryClick },
    { name: 'Menus', icon: '🍽️', action: onMenusClick },
    { name: 'FullCount', icon: '💳', action: () => window.open(links.fullCount, '_blank') },
    { name: 'First Mate Emails', icon: '✉️', action: () => window.open(links.firstMate, '_blank') },
    { name: 'Campus Information', icon: '🏛️', action: onCampusInfoClick },
    { name: 'Event Calendar', icon: '📅', action: onEventCalendarClick },
    { name: 'Request Forms', icon: '📝', action: onRequestFormsClick }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {topics.map((topic) => (
        <button
          key={topic.name}
          onClick={topic.action}
          className="bg-brand-primary rounded-lg p-8 shadow-md hover:bg-brand-secondary transition-all flex flex-col items-center justify-center space-y-4 text-white group active:scale-[0.98]"
        >
          <span className="text-4xl group-hover:scale-110 transition-transform">{topic.icon}</span>
          <span className="text-sm font-bold tracking-[0.12em] text-center leading-tight uppercase font-sans">{topic.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TopicButtons;
