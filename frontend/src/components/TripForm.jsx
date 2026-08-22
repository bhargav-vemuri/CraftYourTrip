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
    <div className="w-full max-w-3xl mx-auto mb-16">
      <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Plan Your Next Adventure</h2>

          <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              if (!isLoading) {
                handleSubmit(e);
              }
            }
          }}>
            <fieldset disabled={isLoading} className="space-y-6">
              <TextAreaField
                id="trip-description"
                label="Destination / Trip Description"
                placeholder="Example: I'm planning a 5-day trip to Japan in December with a budget of ₹50,000. I enjoy anime, street food, temples and nature."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
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
                label="Interests"
                interests={INTERESTS_LIST}
                selectedInterests={interests}
                onChange={setInterests}
                disabled={isLoading}
              />
            </fieldset>

            {!isLoading && !error && (
              <div className="pt-4 flex justify-center sm:justify-end border-t border-gray-100">
                <PrimaryButton type="submit" disabled={isLoading}>
                  ✨ Craft My Trip
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
