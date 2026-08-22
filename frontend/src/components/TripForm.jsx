import React, { useState, useRef, useEffect } from 'react';
import TextAreaField from './TextAreaField';
import InputField from './InputField';
import TravelStyleSelect from './TravelStyleSelect';
import InterestSelector from './InterestSelector';
import PrimaryButton from './PrimaryButton';
import { TripSkeleton } from './Skeletons';
import ErrorState from './ErrorState';
import { tripService } from '../services/tripService';
import { useToast } from '../hooks/useToast';

const TRAVEL_STYLES = ['Solo', 'Couple', 'Family', 'Friends'];
const INTERESTS_LIST = [
  'Food', 'Adventure', 'Nature', 'History', 'Nightlife', 
  'Shopping', 'Culture', 'Beach', 'Luxury', 'Hidden Gems'
];

export default function TripForm({ onSuccess }) {
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [interests, setInterests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  
  const abortControllerRef = useRef(null);

  // Cleanup on unmount to cancel any pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      const response = await tripService.generateTrip({
        prompt: description,
        budget,
        duration,
        travelStyle,
        interests
      }, signal);
      
      if (response.success && response.itinerary) {
        onSuccess(response.itinerary);
        showToast('Your itinerary is ready!');
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      if (err.isCancelled) {
        // Request was cancelled, ignore it
        return;
      }
      
      let userMessage = 'We encountered an unexpected error.';
      const errMsg = err.error || err.message || '';
      
      if (err.status === 504 || errMsg === 'The request timed out.') {
        userMessage = 'The request took too long. Please try again.';
      } else if (!navigator.onLine || errMsg.toLowerCase().includes('network error')) {
        userMessage = 'We\'re having trouble reaching the AI service.';
      } else if (errMsg && errMsg !== 'Request failed with status code 500') {
        userMessage = errMsg;
      } else if (err.status === 500) {
        userMessage = 'The AI returned an unexpected response.';
      }
      
      setError(userMessage);
    } finally {
      // Only set loading to false if this is still the active request
      if (signal && !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 relative animate-slide-up">
      {/* Decorative background glow behind form */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl transform scale-105 rounded-3xl z-0 animate-pulse-slow"></div>

      <div className="relative z-10 bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-stone-800/80 overflow-hidden mb-8 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_40px_rgb(0,0,0,0.3)]">
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">Design Your Trip</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              if (!isLoading) {
                handleSubmit(e);
              }
            }
          }}>
            <fieldset disabled={isLoading} className="space-y-8">
              <TextAreaField
                id="trip-description"
                label="Destination & Vibe"
                placeholder="Where to? (e.g., 'A 5-day cyberpunk street food tour of Tokyo')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50/50 dark:bg-stone-950/50 p-6 rounded-2xl border border-stone-100 dark:border-stone-800/50">
                <InputField
                  id="budget"
                  label="Budget (Optional)"
                  placeholder="e.g. ₹50,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                
                <InputField
                  id="duration"
                  label="Travel Duration"
                  placeholder="e.g. 5 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                
                <InputField
                  id="travelers"
                  label="Travelers"
                  type="number"
                  placeholder="e.g. 2"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  required
                />
                
                <TravelStyleSelect
                  id="travel-style"
                  label="Travel Style"
                  options={TRAVEL_STYLES}
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  required
                />
              </div>

              <InterestSelector
                label="What excites you?"
                interests={INTERESTS_LIST}
                selectedInterests={interests}
                onChange={setInterests}
                disabled={isLoading}
              />
            </fieldset>

            {!isLoading && !error && (
              <div className="pt-6 flex justify-center sm:justify-end border-t border-stone-200/50 dark:border-stone-800/50">
                <PrimaryButton type="submit" disabled={isLoading}>
                  <span className="flex items-center gap-2">
                    ✨ Generate Intelligence
                  </span>
                </PrimaryButton>
              </div>
            )}
          </form>
        </div>
      </div>

      {isLoading && <TripSkeleton />}
      {error && !isLoading && <ErrorState message={error} onRetry={handleSubmit} />}
    </div>
  );
}
