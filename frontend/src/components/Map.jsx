import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629 // Center of India as fallback
};

export default function Map({ itinerary, activeStopId, onMarkerClick }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Extract all valid coordinates from itinerary
  useEffect(() => {
    if (!itinerary || !itinerary.days) return;
    
    const newMarkers = [];
    itinerary.days.forEach(day => {
      day.stops.forEach(stop => {
        if (stop.coordinates && stop.coordinates.lat && stop.coordinates.lng) {
          newMarkers.push({
            id: stop.id,
            position: { lat: stop.coordinates.lat, lng: stop.coordinates.lng },
            title: stop.name,
            dayTitle: day.title,
            dayNum: day.day
          });
        }
      });
    });
    
    setMarkers(newMarkers);
    
    // Auto-fit bounds if we have markers and the map is loaded
    if (map && newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(m => bounds.extend(m.position));
      map.fitBounds(bounds);
      
      // Prevent over-zooming on single marker
      const listener = window.google.maps.event.addListener(map, "idle", () => { 
        if (map.getZoom() > 14) map.setZoom(14); 
        window.google.maps.event.removeListener(listener); 
      });
    }
  }, [itinerary, map]);

  // Handle activeStopId changes (e.g. dragging)
  useEffect(() => {
    if (activeStopId) {
      const marker = markers.find(m => m.id === activeStopId);
      if (marker) setSelectedMarker(marker);
    } else {
      setSelectedMarker(null);
    }
  }, [activeStopId, markers]);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-6 text-center">
        <div>
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Unable to load Google Maps</p>
          <p className="text-sm text-gray-500 mt-1">Please check your API key configuration.</p>
        </div>
      </div>
    );
  }

  return isLoaded ? (
    <div className="w-full h-full relative border-4 border-white dark:border-gray-900 rounded-2xl shadow-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markers.length > 0 ? markers[0].position : defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            // Standard minimal style (could be linked to Dark Mode context, but keeping it simple)
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
          ]
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => {
              setSelectedMarker(marker);
              if (onMarkerClick) onMarkerClick(marker.id);
            }}
            animation={activeStopId === marker.id ? window.google.maps.Animation.BOUNCE : null}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: activeStopId === marker.id ? '#3b82f6' : '#ef4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1 max-w-[200px]">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Day {selectedMarker.dayNum}</p>
              <h3 className="font-bold text-gray-900 leading-tight">{selectedMarker.title}</h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
  );
}
