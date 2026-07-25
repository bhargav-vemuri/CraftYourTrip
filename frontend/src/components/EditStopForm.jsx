import React, { useState } from 'react';

const CATEGORIES = ['Culture', 'Food', 'Nature', 'Adventure', 'Shopping', 'Nightlife', 'Leisure', 'Other'];

export default function EditStopForm({ initialStop, onSave, onCancel }) {
  const [time, setTime] = useState(initialStop?.time || '');
  const [name, setName] = useState(initialStop?.name || '');
  const [category, setCategory] = useState(initialStop?.category || 'Culture');
  const [duration, setDuration] = useState(initialStop?.duration || '');
  const [description, setDescription] = useState(initialStop?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Time</label>
          <input 
            type="text" 
            value={time} 
            onChange={e => setTime(e.target.value)} 
            placeholder="e.g. 09:00"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Location Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="e.g. Tokyo Tower"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Duration</label>
          <input 
            type="text" 
            value={duration} 
            onChange={e => setDuration(e.target.value)} 
            placeholder="e.g. 2 hours"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="What will you do here?"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-y"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
          Save Stop
        </button>
      </div>
    </form>
  );
}
