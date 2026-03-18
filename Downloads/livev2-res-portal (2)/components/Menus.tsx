
import React, { useState } from 'react';
import { BRAND } from '../constants';

interface MenuContent {
  id: string;
  title: string;
  sections: { name: string; items: string[] }[];
}

const CORE_MENUS: MenuContent[] = [
  {
    id: 'beverages',
    title: 'Beverages Menu',
    sections: [
      { name: 'Wine (White)', items: ['Yalumba Sauvignon Blanc $5/$15', 'Dr. Loosen Riesling $5/$15', 'Zenato Pinot Grigio $5/$15', 'Sonoma Chardonnay $8/$24'] },
      { name: 'Wine (Red)', items: ['Tres Ojos Garnacha $4/$12', 'Oxford Landing Merlot $5/$15', 'Meiomi Pinot Noir $7/$20'] },
      { name: 'Cocktails', items: ['People\'s Choice Margarita $8', 'New Fashioned $13', 'Landing Manhattan $15', 'Williamsburg Negroni $10'] },
      { name: 'Beer & Spirits', items: ['Devils Backbone Vienna Lager $3', 'Bud Light $3', 'Dockside Draft $5', 'Hennessey Cognac $18', 'Tito\'s Vodka $8'] }
    ]
  },
  {
    id: 'brunch',
    title: 'Sunday Brunch Menu',
    sections: [
      { name: 'Starters', items: ['Soup Du Jour', 'Salad Bar', 'Broccoli & Chickpea Salad', 'Cucumber Tomato Red Onion'] },
      { name: 'Chef Action Stations', items: ['Omelet Bar (Bacon, Sausage, Ham, Peppers, Tomatoes, Spinach, Onions, Cheese)', 'Carving Station (Roasted Lamb with Garlic, Herbs & Demi Glace)'] },
      { name: 'Entrees', items: ['Catch of the Day: Sauteed Jumbo Shrimp', 'Chicken & Andoullie Alfredo', 'Zucchini, Grape Tomato & Ricotta Frittata'] },
      { name: 'Sides', items: ['Bread & Pastry Station', 'Cafe Roasted Potatoes', 'Bacon Strips & Sausage Link', 'Butter Penne Pasta', 'Fresh Grilled Vegetables', 'Glazed Carrots'] }
    ]
  },
  {
    id: 'cove-daily',
    title: 'The Cove - Daily Menu',
    sections: [
      { name: 'Appetizers', items: ['Cove Rotel Dip $2', 'Shrimp Cocktail $2', 'Veggie Spring Rolls $2', 'Williamsburg Chili $2'] },
      { name: 'Salads', items: ['Classic Caesar $9', 'Cove Skinny Cobb $9', 'Edgewood Trio $9', 'Roasted Sweet Potato & Black Bean $9'] },
      { name: 'Handhelds', items: ['Cove Burger $9', 'Hot Reuben Panini $9', 'Classic Hot Dog $9', 'Baja Shrimp Quesadilla $9', 'Chicken Club Panini $9'] },
      { name: 'Entrees', items: ['Boneless Short Ribs $9', 'Pan Roasted Haddock $9', 'Vegetarian Harvest Bowl $9', 'Linguine with Alfredo $9', 'Grilled Skirt Steak $9'] }
    ]
  },
  {
    id: 'specials-mdr',
    title: 'Specials: Main Dining Room',
    sections: [
      { name: 'Weekly Specials (March 2 - March 7)', items: [
        'Monday: Mango Glazed Grilled Shrimp',
        'Tuesday: Pork Scaloppine',
        'Wednesday: Sundried Tomato Alfredo',
        'Thursday: Peach BBQ Pork Ribeye',
        'Friday: Pan-Seared Flounder',
        'Saturday: Seared Scallops'
      ]}
    ]
  },
  {
    id: 'specials-cove-takeout',
    title: 'Specials: Cove Take Out',
    sections: [
      { name: 'Weekly Takeout Specials (March 2 - March 7)', items: [
        'Monday: Seasoned Shrimp Cakes',
        'Tuesday: Lean Meat Lasagna',
        'Wednesday: Fried Chicken & Waffles',
        'Thursday: Brown Sugar Rubbed Pork Loin',
        'Friday: Braised Beef Tips',
        'Saturday: Baked Ziti with Italian Sausage'
      ]}
    ]
  },
  {
    id: 'specials-cove-dinein',
    title: 'Specials: Cove Dine In',
    sections: [
      { name: 'Weekly Specials (March 2 - March 7)', items: [
        'Monday: Italian Hoagie',
        'Tuesday: Beef or Chicken Quesadilla',
        'Wednesday: Cajun Salmon',
        'Thursday: Chicken Cacciatore',
        'Friday: Brisket Mac N’ Cheese',
        'Saturday: New England Lobster Roll'
      ]}
    ]
  },
  {
    id: 'main-dinner',
    title: 'Main Dining Room Dinner',
    sections: [
      { name: 'Appetizers & Salads', items: ['Lemongrass Chicken Potstickers $2', 'Mini Beef Wellington $2', 'California Roll $2', 'Zucchini & Pecorino Salad $11', 'Roasted Beets & Goat Cheese $11'] },
      { name: 'Entrees', items: ['Roasted Beef Tenderloin $11', 'Lemon Dill Trout $11', 'Veal Parmesan $11', 'Cheese Manicotti $11', 'Chipotle Mango Pit Ham $11'] },
      { name: 'Handhelds & Healthier', items: ['Peanut Butter Burger $11', 'Classic French Dip $11', 'Grilled Salmon $9', 'Herb Seared Chicken Breast $9'] }
    ]
  }
];

const Menus: React.FC<{ onBack: () => void, customItems?: string[], onSelectCustom: (btn: string) => void }> = ({ onBack, customItems = [], onSelectCustom }) => {
  const [selectedMenuForViewing, setSelectedMenuForViewing] = useState<MenuContent | null>(null);

  const handlePrint = (menuId?: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const menusToPrint = menuId 
      ? CORE_MENUS.filter(m => m.id === menuId) 
      : CORE_MENUS;

    let html = `
      <html>
        <head>
          <title>Williamsburg Landing Menus</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #00385d; }
            h1 { border-bottom: 4px solid #00385d; padding-bottom: 10px; }
            h2 { color: #4a7da4; margin-top: 30px; border-bottom: 1px solid #ccc; }
            h3 { margin-top: 20px; font-size: 1.2em; }
            ul { list-style: none; padding-left: 0; }
            li { padding: 5px 0; border-bottom: 1px dashed #eee; font-size: 1.1em; }
            .menu-page { page-break-after: always; }
          </style>
        </head>
        <body>
          <center><h1>Williamsburg Landing Dining Menus</h1></center>
    `;

    menusToPrint.forEach(menu => {
      html += `
        <div class="menu-page">
          <h2>${menu.title}</h2>
          ${menu.sections.map(sec => `
            <h3>${sec.name}</h3>
            <ul>${sec.items.map(item => `<li>${item}</li>`).join('')}</ul>
          `).join('')}
        </div>
      `;
    });

    html += `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const coreTitles = CORE_MENUS.map(m => m.title);
  const displayItems = customItems.map(name => {
    const core = CORE_MENUS.find(m => m.title === name);
    if (core) {
      return {
        name: core.title,
        id: core.id,
        isCore: true,
        action: () => setSelectedMenuForViewing(core)
      };
    }
    return {
      name,
      id: name,
      isCore: false,
      action: () => onSelectCustom(name)
    };
  });

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-brand-gold pb-6">
        <div>
          <p className="section-label mb-1">Dining Services</p>
          <h2 className="text-4xl font-display text-brand-primary">Dining Menus</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => handlePrint()}
            className="btn-primary text-sm flex items-center gap-2"
          >
            🖨️ Print All Menus
          </button>
          <button 
            onClick={onBack}
            className="btn-secondary text-sm"
          >
            ← Back to Portal
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {displayItems.map((menu) => (
          <div key={menu.id} className="card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-l-8 border-brand-primary transition-all hover:shadow-md">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-display text-brand-primary mb-2">{menu.name}</h3>
              <p className="text-brand-text-muted font-medium italic">Available for viewing and printing</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={menu.action}
                className="flex-1 md:w-auto btn-primary text-sm"
              >
                View Menu
              </button>
              {menu.isCore && (
                <button 
                  onClick={() => handlePrint(menu.id)}
                  className="flex-1 md:w-auto btn-secondary text-sm flex items-center justify-center gap-2"
                >
                  <span>🖨️</span>
                  <span>Print</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-bg p-8 rounded-xl border border-brand-secondary/10">
        <p className="text-lg font-medium text-brand-primary text-center leading-relaxed italic">
          Menu items are subject to change. Please visit the dining rooms for the most up-to-date daily specials.
        </p>
      </div>

      {/* View Menu Modal */}
      {selectedMenuForViewing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-t-4 border-brand-gold">
            {/* Modal Header */}
            <div className="bg-white p-8 border-b border-brand-bg flex justify-between items-start">
              <div>
                <p className="section-label mb-1">Dining Menu</p>
                <h2 className="text-4xl font-display text-brand-primary leading-tight">
                  {selectedMenuForViewing.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedMenuForViewing(null)}
                className="text-brand-text-muted hover:text-brand-primary transition-colors p-2"
              >
                <span className="text-2xl">✕</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-10 overflow-y-auto bg-brand-bg/30">
              {selectedMenuForViewing.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-6">
                  <h3 className="text-xl font-bold text-brand-gold border-b border-brand-gold/20 pb-2 uppercase tracking-[0.12em]">
                    {section.name}
                  </h3>
                  <ul className="space-y-4">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-lg font-medium text-brand-text flex justify-between gap-4 border-b border-white pb-2">
                        <span className="flex-1 leading-relaxed">{item.split(' $')[0]}</span>
                        {item.includes(' $') && (
                          <span className="text-brand-primary font-bold whitespace-nowrap">
                            ${item.split(' $')[1]}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-white border-t border-brand-bg flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => handlePrint(selectedMenuForViewing.id)}
                className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
              >
                🖨️ Print This Menu
              </button>
              <button 
                onClick={() => setSelectedMenuForViewing(null)}
                className="flex-1 btn-primary text-sm uppercase tracking-widest"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menus;
