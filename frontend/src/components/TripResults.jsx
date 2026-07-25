import React, { useState } from 'react';
import DayCard from './DayCard';
import ConfirmationDialog from './ConfirmationDialog';

export default function TripResults({ itinerary }) {
  // Manage mutable itinerary state locally
  const [data, setData] = useState(itinerary);
  
  // Confirmation Dialog state
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  if (!data) return null;

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  // Immutable Updates
  const handleDeleteDay = (dayIndex) => {
    setDialog({
      isOpen: true,
      title: 'Delete Day',
      message: `Are you sure you want to delete Day ${data.days[dayIndex].day}? This action cannot be undone.`,
      onConfirm: () => {
        const newDays = [...data.days];
        newDays.splice(dayIndex, 1);
        setData({ ...data, days: newDays });
        closeDialog();
      }
    });
  };

  const handleDeleteStop = (dayIndex, stopId) => {
    const stop = data.days[dayIndex].stops.find(s => s.id === stopId);
    setDialog({
      isOpen: true,
      title: 'Delete Stop',
      message: `Are you sure you want to delete "${stop?.name}"?`,
      onConfirm: () => {
        const newDays = [...data.days];
        newDays[dayIndex].stops = newDays[dayIndex].stops.filter(s => s.id !== stopId);
        setData({ ...data, days: newDays });
        closeDialog();
      }
    });
  };

  const handleAddStop = (dayIndex, newStop) => {
    const newDays = [...data.days];
    newDays[dayIndex].stops.push(newStop);
    setData({ ...data, days: newDays });
  };

  const handleUpdateStop = (dayIndex, stopId, updatedStop) => {
    const newDays = [...data.days];
    const stopIndex = newDays[dayIndex].stops.findIndex(s => s.id === stopId);
    if (stopIndex > -1) {
      newDays[dayIndex].stops[stopIndex] = updatedStop;
      setData({ ...data, days: newDays });
    }
  };

  const handleMoveStop = (dayIndex, stopIndex, direction) => {
    const newDays = [...data.days];
    const stops = newDays[dayIndex].stops;
    
    // Bounds check
    if (
      (direction === -1 && stopIndex === 0) || 
      (direction === 1 && stopIndex === stops.length - 1)
    ) return;

    // Swap
    const temp = stops[stopIndex];
    stops[stopIndex] = stops[stopIndex + direction];
    stops[stopIndex + direction] = temp;
    
    setData({ ...data, days: newDays });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-20 animate-fade-in relative">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {data.tripTitle}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          {data.summary}
        </p>
      </div>

      <div className="space-y-8">
        {data.days.map((day, index) => (
          <DayCard 
            key={`day-${day.day}-${index}`} 
            day={day} 
            dayIndex={index}
            onDeleteDay={handleDeleteDay}
            onAddStop={handleAddStop}
            onUpdateStop={handleUpdateStop}
            onDeleteStop={handleDeleteStop}
            onMoveStop={handleMoveStop}
          />
        ))}
        
        {data.days.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Your itinerary is empty</h3>
            <p className="text-gray-500 mt-2">You deleted all the days. Time to start over!</p>
          </div>
        )}
      </div>

      <ConfirmationDialog 
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
}
