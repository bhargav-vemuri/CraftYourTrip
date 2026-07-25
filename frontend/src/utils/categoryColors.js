export function getCategoryColorClasses(category) {
  if (!category) return 'bg-blue-100 text-blue-800 border-blue-200';
  
  const normalized = category.toLowerCase();
  
  if (normalized.includes('food') || normalized.includes('dining')) {
    return 'bg-orange-100 text-orange-800 border-orange-200';
  }
  if (normalized.includes('nature') || normalized.includes('park')) {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  if (normalized.includes('culture') || normalized.includes('history')) {
    return 'bg-purple-100 text-purple-800 border-purple-200';
  }
  if (normalized.includes('adventure')) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  if (normalized.includes('shopping')) {
    return 'bg-pink-100 text-pink-800 border-pink-200';
  }
  if (normalized.includes('nightlife') || normalized.includes('drinks')) {
    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  }
  
  // Default fallback
  return 'bg-gray-100 text-gray-800 border-gray-200';
}
