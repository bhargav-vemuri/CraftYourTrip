import React from 'react';

export default function InterestSelector({ label, interests, selectedInterests, onChange, disabled }) {
  const toggleInterest = (interest) => {
    if (disabled) return;
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter((i) => i !== interest));
    } else {
      onChange([...selectedInterests, interest]);
    }
  };

  return (
    <div className="flex flex-col mb-6">
      <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-4">
        {label}
      </label>
      <div className="flex flex-wrap gap-3">
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              disabled={disabled}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                disabled
                  ? isSelected ? 'bg-emerald-50 text-emerald-400 border-emerald-200 cursor-not-allowed opacity-70' : 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed opacity-70'
                  : isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/30 scale-105'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
    </div>
  );
}
