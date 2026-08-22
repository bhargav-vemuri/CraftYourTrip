import React, { useState } from 'react';
import { DndContext, closestCorners, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import DayCard from './DayCard';
import StopCard from './StopCard';
import ConfirmationDialog from './ConfirmationDialog';
import EmptyState from './EmptyState';
import Map from './Map';
import BudgetSummary from './BudgetSummary';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useToast } from '../hooks/useToast';
import { tripService } from '../services/tripService';

export default function TripResults({ itinerary: data, onUpdateItinerary: setData }) {
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [activeStopId, setActiveStopId] = useState(null);
  
  const { sensors, activeId: dragActiveId, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop(data, setData);
  const { showToast } = useToast();

  if (!data) return null;

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  const handleDeleteDay = (dayIndex) => {
    setDialog({
      isOpen: true, title: 'Delete Day',
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
      isOpen: true, title: 'Delete Stop',
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

  // AI Actions
  const handleOptimizeDay = async (dayIndex) => {
    const day = data.days[dayIndex];
    showToast(`Optimizing Day ${day.day}...`, 'info');
    try {
      const optimizedDay = await tripService.optimizeDay(day, { budget: data.budget }, data.destination);
      if (optimizedDay) {
        const newDays = [...data.days];
        newDays[dayIndex] = optimizedDay;
        setData({ ...data, days: newDays });
        showToast(`Day ${day.day} optimized successfully!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Optimization failed. Please try again.', 'error');
    }
  };

  const handleReplaceStop = async (dayIndex, stopId) => {
    const day = data.days[dayIndex];
    const stop = day.stops.find(s => s.id === stopId);
    
    // Quick prompt for replace criteria (simple browser prompt for now, could be a modal)
    const instruction = window.prompt(`What kind of alternative are you looking for instead of "${stop.name}"? (e.g. "Cheaper", "More indoors", "Food instead")`);
    if (instruction === null) return; // User cancelled
    
    showToast(`Finding replacement for ${stop.name}...`, 'info');
    try {
      const newStop = await tripService.replaceStop(stop, data, instruction, data.destination);
      if (newStop) {
        handleUpdateStop(dayIndex, stopId, newStop);
        showToast('Stop replaced successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Replacement failed. Please try again.', 'error');
    }
  };

  const getActiveStop = () => {
    if (!dragActiveId) return null;
    for (const day of data.days) {
      const stop = day.stops.find(s => s.id === dragActiveId);
      if (stop) return stop;
    }
    return null;
  };
  const draggedStop = getActiveStop();

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  // Setup interaction when clicking stops or map
  const onStopClick = (stopId) => setActiveStopId(stopId);

  return (
    <div className="w-full max-w-7xl mx-auto mb-20 animate-fade-in relative px-4">
      
      <div className="text-center mb-16 relative">
        <h2 className="text-5xl sm:text-6xl font-black text-stone-900 dark:text-white mb-6 tracking-tighter leading-tight drop-shadow-sm">
          {data.tripTitle}
        </h2>
        <p className="text-xl sm:text-2xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto font-medium leading-relaxed mb-6">
          {data.summary}
        </p>
      </div>

      <BudgetSummary itinerary={data} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Itinerary */}
        <div className="w-full lg:w-3/5 order-2 lg:order-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => {
              setActiveStopId(e.active.id);
              handleDragStart(e);
            }}
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
                  onOptimize={() => handleOptimizeDay(index)}
                  onReplaceStop={(stopId) => handleReplaceStop(index, stopId)}
                  activeStopId={activeStopId}
                  onStopClick={onStopClick}
                />
              ))}
              
              {data.days.length === 0 && (
                <div className="mt-12">
                  <EmptyState />
                </div>
              )}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
              {draggedStop ? (
                <StopCard 
                  stop={draggedStop} 
                  isOverlay={true}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  onToggleFavorite={() => {}}
                  onReplace={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Right Column: Sticky Map */}
        <div className="w-full lg:w-2/5 order-1 lg:order-2 lg:sticky lg:top-24 h-[400px] lg:h-[calc(100vh-140px)] z-10 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-stone-200 dark:ring-white/10 transition-shadow hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)]">
          <Map 
            itinerary={data} 
            activeStopId={activeStopId || dragActiveId}
            onMarkerClick={(id) => {
              setActiveStopId(id);
              // Scroll to the card slightly (hacky but works without refs for now)
              const el = document.getElementById(`stop-${id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />
        </div>
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
