import { useState } from 'react';
import { Layers, Target, ArrowRight, X } from 'lucide-react';

const OPTIONS = [
  {
    id: 'adaptive',
    icon: Layers,
    title: 'Adaptive Format',
    description:
      'Preserves the structure of your original resume. Sections appear in the exact order you originally placed them.',
    badge: 'Recommended for experienced professionals',
  },
  {
    id: 'professional',
    icon: Target,
    title: 'ATS-Optimized Format',
    description:
      'Industry-standard layout. Sections are ordered for maximum ATS performance and recruiter readability.',
    badge: 'Recommended for fresh graduates',
  },
];

export default function FormatPickerModal({ onSelect, onClose }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-surface-dark-light border border-border-primary rounded-card shadow-2xl shadow-black/50 p-8">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <h2 className="text-text-primary font-bold text-xl mb-1">Choose Your Resume Format</h2>
          <p className="text-text-muted text-sm">How would you like your sections arranged?</p>
        </div>

        <div className="space-y-3 mb-6">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150
                  ${isSelected
                    ? 'border-brand-primary bg-brand-primary/10'
                    : 'border-border-primary bg-surface-dark hover:border-brand-primary/50'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-brand-primary/20' : 'bg-surface-dark-mid'}`}>
                    <Icon size={20} className={isSelected ? 'text-brand-primary' : 'text-text-muted'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {opt.title}
                      </span>
                      {isSelected && (
                        <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed">{opt.description}</p>
                    <p className="text-xs mt-1.5 text-brand-primary/70">{opt.badge}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className="w-full py-3 rounded-button font-semibold text-sm flex items-center justify-center gap-2
            bg-gradient-to-r from-brand-primary to-brand-secondary text-white
            hover:from-brand-primary-hover hover:to-brand-secondary-hover
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200"
        >
          Continue <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}
