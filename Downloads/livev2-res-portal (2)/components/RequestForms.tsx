
import React from 'react';
import { BRAND } from '../constants';

interface RequestFormsProps {
  onBack: () => void;
  onSelectCustom: (buttonName: string) => void;
  customItems?: string[];
}

const RequestForms: React.FC<RequestFormsProps> = ({ onBack, onSelectCustom, customItems = [] }) => {
  const coreForms: Record<string, { icon: string, url: string, desc: string }> = {
    'Handyman Services Form': { 
      icon: '🛠️', 
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSf-z3yTE8fKEGRls2wRe1qNHM216W2zGPaKOsREMVr-YVQwlQ/viewform',
      desc: 'Request help with home repairs, shelf hanging, or minor technical issues.'
    },
    'Guest Room Reservations Form': {
      icon: '🛏️',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSclMolJVJpOg6r7U_tI6_FS6argOccCZIq8qVzTDluUhmWcNA/viewform',
      desc: 'Reserve a guest room for family and friends visiting Williamsburg Landing.'
    },
    'Meal Plan Change Request Form': {
      icon: '🍴',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSf8pD1Fip4cjIbCOjaD1IqPB8Kohi26NutRqYQaPsmPFgmCzA/viewform',
      desc: 'Submit a request to change your current dining meal plan options.'
    },
    'Transportation Request Form': {
      icon: '🚗',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSe-BGBqLAO4ULtAYBJxgKHevdezdGj4eSPM7RaGHxFnUfsBKw/viewform',
      desc: 'Schedule on-campus or off-campus transportation for appointments or errands.'
    },
    'Housekeeping Request Form': {
      icon: '🧹',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSfZ5T2YfO09pJ1cFDbew26oohHqh4n7MrovMA2ki8AKgePYBg/viewform',
      desc: 'Request additional cleaning services or report specific housekeeping needs.'
    },
    'Employee Spot Award Request Form': {
      icon: '🌟',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSfTFcgTrs_6EfAUxEm0wl5_tcKbsJO6kr7ZjEyEy94cuNNgyA/viewform',
      desc: 'Nominate an outstanding employee for a spot award to recognize their excellent service.'
    }
  };

  const formsList = customItems.map(name => {
    if (coreForms[name]) {
      return {
        name,
        icon: coreForms[name].icon,
        description: coreForms[name].desc,
        action: () => window.open(coreForms[name].url, '_blank')
      };
    }
    return {
      name,
      icon: '📄',
      description: 'Fill out the ' + name + ' for Williamsburg Landing.',
      action: () => onSelectCustom(name)
    };
  });

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-brand-gold pb-6">
        <div>
          <p className="section-label mb-1">Administrative Services</p>
          <h2 className="text-4xl font-display text-brand-primary">Request Forms</h2>
        </div>
        <button 
          onClick={onBack}
          className="btn-secondary text-sm"
        >
          ← Back to Portal
        </button>
      </div>

      <div className="grid gap-6">
        {formsList.map((form, idx) => (
          <button 
            key={idx}
            onClick={form.action}
            className="card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-l-8 border-brand-primary text-left group hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-6 flex-1">
              <span className="text-4xl bg-brand-bg p-4 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">{form.icon}</span>
              <div>
                <h3 className="text-2xl font-display text-brand-primary group-hover:text-brand-secondary transition-colors">{form.name}</h3>
                <p className="text-brand-text-muted font-medium mt-1 leading-relaxed">{form.description}</p>
              </div>
            </div>
            <div className="w-full md:w-auto btn-primary text-sm whitespace-nowrap">
              Open Form
            </div>
          </button>
        ))}
      </div>

      <div className="bg-brand-bg p-8 rounded-xl border border-brand-secondary/10">
        <p className="text-lg font-medium text-brand-primary text-center leading-relaxed italic">
          Need help with these forms? Please contact the Front Desk at (757) 253-0303 or visit the Administration office.
        </p>
      </div>
    </div>
  );
};

export default RequestForms;
