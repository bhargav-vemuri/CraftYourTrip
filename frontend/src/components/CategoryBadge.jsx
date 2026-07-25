import React from 'react';

export default function CategoryBadge({ category }) {
  // Simple mapping for some common categories to colors
  const getColorClasses = (cat) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes('food') || normalized.includes('dining')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (normalized.includes('culture') || normalized.includes('history')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (normalized.includes('nature') || normalized.includes('park')) return 'bg-green-100 text-green-800 border-green-200';
    if (normalized.includes('adventure')) return 'bg-red-100 text-red-800 border-red-200';
    if (normalized.includes('shopping')) return 'bg-pink-100 text-pink-800 border-pink-200';
    return 'bg-blue-100 text-blue-800 border-blue-200'; // Default
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorClasses(category)}`}>
      {category}
    </span>
  );
}
