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
      <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4">
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
                  ? isSelected ? 'bg-violet-50 text-violet-400 border-violet-200 cursor-not-allowed opacity-70' : 'bg-zinc-50 text-zinc-400 border-zinc-200 cursor-not-allowed opacity-70'
                  : isSelected
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/30 scale-105'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400'
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
