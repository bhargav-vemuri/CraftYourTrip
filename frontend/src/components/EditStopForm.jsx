import React, { useState } from 'react';

const CATEGORIES = ['Culture', 'Food', 'Nature', 'Adventure', 'Shopping', 'Nightlife', 'Leisure', 'Other'];

export default function EditStopForm({ initialStop, onSave, onCancel }) {
  const [time, setTime] = useState(initialStop?.time || '');
  const [name, setName] = useState(initialStop?.name || '');
  const [category, setCategory] = useState(initialStop?.category || 'Culture');
  const [duration, setDuration] = useState(initialStop?.duration || '');
  const [description, setDescription] = useState(initialStop?.description || '');

  const handleSave = (e) => {
    if (e) e.preventDefault();
    onSave({
      id: initialStop?.id || `new-stop-${Date.now()}`,
      time,
      name,
      category,
      duration,
      description
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-blue-200 dark:border-blue-800 p-5 shadow-md ring-4 ring-blue-50 dark:ring-blue-900/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Time</label>
          <input 
            type="text" 
            value={time} 
            onChange={e => setTime(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 09:00 AM"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Location / Activity</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Tsukiji Fish Market"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Description</label>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
          placeholder="What will you do here?"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Duration</label>
          <input 
            type="text" 
            value={duration} 
            onChange={e => setDuration(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 2 hours"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Category</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
