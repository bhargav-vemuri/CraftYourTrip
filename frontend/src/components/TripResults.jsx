import React, { useState } from 'react';
import { DndContext, closestCorners, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import DayCard from './DayCard';
import StopCard from './StopCard';
import ConfirmationDialog from './ConfirmationDialog';
import EmptyState from './EmptyState';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

export default function TripResults({ itinerary: data, onUpdateItinerary: setData }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const { sensors, activeId, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(data, setData);

  if (!data) return null;

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

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

  const handleToggleFavorite = (dayIndex, stopId) => {
    const newDays = [...data.days];
    const stopIndex = newDays[dayIndex].stops.findIndex(s => s.id === stopId);
    if (stopIndex > -1) {
      const stop = newDays[dayIndex].stops[stopIndex];
      newDays[dayIndex].stops[stopIndex] = { ...stop, isFavorite: !stop.isFavorite };
      setData({ ...data, days: newDays });
    }
  };

  const getActiveStop = () => {
    if (!activeId) return null;
    for (const day of data.days) {
      const stop = day.stops.find(s => s.id === activeId);
      if (stop) return stop;
    }
    return null;
  };
  const activeStop = getActiveStop();

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  // Export functions
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert('Itinerary copied to clipboard as JSON!');
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-trip-itinerary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${data.tripTitle}\n\n${data.summary}\n\n`;
    data.days.forEach(day => {
      md += `## Day ${day.day}: ${day.title}\n\n`;
      day.stops.forEach(stop => {
        md += `### ${stop.time} - ${stop.name} ${stop.isFavorite ? '⭐' : ''}\n`;
        md += `**Category:** ${stop.category} | **Duration:** ${stop.duration}\n\n`;
        md += `${stop.description}\n\n`;
      });
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-trip-itinerary.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-20 animate-fade-in relative">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          {data.tripTitle}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-6">
          {data.summary}
        </p>

        {/* Export Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={handleCopyJSON} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Copy JSON
          </button>
          <button onClick={handleDownloadJSON} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export JSON
          </button>
          <button onClick={handleDownloadMarkdown} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export MD
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
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
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
          
          {data.days.length === 0 && (
            <div className="mt-12">
              <EmptyState />
            </div>
          )}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeStop ? (
            <StopCard 
              stop={activeStop} 
              isOverlay={true}
              onUpdate={() => {}}
              onDelete={() => {}}
              onToggleFavorite={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

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
