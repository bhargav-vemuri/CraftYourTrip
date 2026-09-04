import React, { useState } from 'react';
import DayCard from './DayCard';
import StopCard from './StopCard';
import ConfirmationDialog from './ConfirmationDialog';
import EmptyState from './EmptyState';
import Map from './Map';
import BudgetSummary from './BudgetSummary';
import { useToast } from '../hooks/useToast';
import { tripService } from '../services/tripService';

export default function TripResults({ itinerary: data, onUpdateItinerary: setData }) {
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [activeStopId, setActiveStopId] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  
  const { showToast } = useToast();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let mostVisible = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry;
          }
        });
        
        if (mostVisible) {
          const index = parseInt(mostVisible.target.getAttribute('data-day-index'), 10);
          if (!isNaN(index)) setActiveDayIndex(index);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] }
    );

    const dayElements = document.querySelectorAll('.day-container');
    dayElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [data]);

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


  // Setup interaction when clicking stops or map
  const onStopClick = (stopId) => setActiveStopId(stopId);

  return (
    <div className="w-full max-w-7xl mx-auto mb-20 relative px-4">
      
      <div className="text-center mb-16 relative group">
        <h2 className="text-5xl sm:text-6xl font-black text-stone-900 dark:text-white mb-6 tracking-tighter leading-tight drop-shadow-sm">
          {data.tripTitle}
        </h2>
        <p className="text-xl sm:text-2xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto font-medium leading-relaxed mb-6">
          {data.summary}
        </p>

        {/* Export Options */}
        <div className="flex items-center justify-center gap-4 mt-6 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Save as PDF
          </button>
          
          <button 
            onClick={() => {
              const text = data.days.map(d => `Day ${d.day}: ${d.title}\n` + d.stops.map(s => `- ${s.name}`).join('\n')).join('\n\n');
              navigator.clipboard.writeText(`Trip: ${data.tripTitle}\n\n${text}`);
              showToast('Copied to clipboard!', 'success');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            Copy Trip
          </button>
        </div>
      </div>

      <BudgetSummary itinerary={data} />

      {/* Side-by-Side Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* Itinerary Timeline (Left) */}
        <div className="w-full lg:w-1/2 xl:w-[55%] print:w-full">
          <div className="space-y-12">
            {data.days.map((day, index) => (
              <div key={`day-wrap-${day.day}-${index}`} data-day-index={index} className="day-container">
                <DayCard 
                  key={`day-${day.day}-${index}`} 
                  day={day} 
                  dayIndex={index}
                  onDeleteDay={handleDeleteDay}
                  onAddStop={(stop) => handleAddStop(index, stop)}
                  onUpdateStop={handleUpdateStop}
                  onDeleteStop={handleDeleteStop}
                  onToggleFavorite={handleToggleFavorite}
                  onOptimize={() => handleOptimizeDay(index)}
                  onReplaceStop={(stopId) => handleReplaceStop(index, stopId)}
                  activeStopId={activeStopId}
                  onStopClick={onStopClick}
                />
              </div>
            ))}
            
            {data.days.length === 0 && (
              <div className="mt-12">
                <EmptyState />
              </div>
            )}
          </div>
        </div>

        {/* Map Section (Right, Sticky) */}
        <div className="w-full lg:w-1/2 xl:w-[45%] lg:sticky lg:top-24 h-[400px] lg:h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-stone-200 dark:ring-white/10 transition-all z-10 print:hidden">
          <Map 
            itinerary={data} 
            activeStopId={activeStopId}
            activeDayIndex={activeDayIndex}
            onMarkerClick={(id) => {
              setActiveStopId(id);
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
