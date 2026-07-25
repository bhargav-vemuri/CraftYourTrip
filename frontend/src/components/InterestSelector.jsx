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
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              disabled={disabled}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                disabled
                  ? isSelected ? 'bg-blue-50 text-blue-400 border-blue-200 cursor-not-allowed opacity-70' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
                  : isSelected
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-gray-50'
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
