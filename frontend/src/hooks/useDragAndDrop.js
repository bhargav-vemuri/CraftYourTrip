import { useState } from 'react';
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export function useDragAndDrop(data, setData) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after moving 5px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) {
      return;
    }

    setData((prev) => {
      // Look up indices inside the updater function using the latest `prev` state
      const findDayIndex = (id) => prev.days.findIndex(day => day.stops.some(stop => stop.id === id));
      
      const activeDayIndex = findDayIndex(active.id);
      const overDayIndex = String(overId).startsWith('day-') 
        ? prev.days.findIndex(d => `day-${d.day}` === overId)
        : findDayIndex(overId);

      if (activeDayIndex === -1 || overDayIndex === -1 || activeDayIndex === overDayIndex) {
        return prev;
      }

      const newDays = [...prev.days];
      const activeItems = [...newDays[activeDayIndex].stops];
      const overItems = [...newDays[overDayIndex].stops];

      const activeIndex = activeItems.findIndex(s => s.id === active.id);
      
      // Safety check to prevent splicing -1 (which would remove the last element and inject undefined)
      if (activeIndex === -1) {
        return prev;
      }

      const overIndex = String(overId).startsWith('day-')
        ? overItems.length
        : overItems.findIndex(s => s.id === overId);

      let newIndex;
      if (String(overId).startsWith('day-')) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current?.translated &&
          active.rect.current.translated.top > (over.rect?.top ?? 0) + (over.rect?.height ?? 0);
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      const [item] = activeItems.splice(activeIndex, 1);
      overItems.splice(newIndex, 0, item);

      newDays[activeDayIndex] = { ...newDays[activeDayIndex], stops: activeItems };
      newDays[overDayIndex] = { ...newDays[overDayIndex], stops: overItems };

      return { ...prev, days: newDays };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    setData((prev) => {
      const findDayIndex = (id) => prev.days.findIndex(day => day.stops.some(stop => stop.id === id));
      
      const activeId = active.id;
      const overId = over.id;

      const activeDayIndex = findDayIndex(activeId);
      const overDayIndex = findDayIndex(overId);

      if (activeDayIndex === -1 || overDayIndex === -1) return prev;

      // Moving within the same day
      if (activeDayIndex === overDayIndex && activeId !== overId) {
        const newDays = [...prev.days];
        const stops = [...newDays[activeDayIndex].stops];
        
        const oldIndex = stops.findIndex(s => s.id === activeId);
        const newIndex = stops.findIndex(s => s.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          newDays[activeDayIndex] = {
            ...newDays[activeDayIndex],
            stops: arrayMove(stops, oldIndex, newIndex)
          };
          return { ...prev, days: newDays };
        }
      }
      
      return prev;
    });
  };

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
}
