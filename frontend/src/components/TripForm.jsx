import React, { useState } from 'react';
import TextAreaField from './TextAreaField';
import InputField from './InputField';
import TravelStyleSelect from './TravelStyleSelect';
import InterestSelector from './InterestSelector';
import PrimaryButton from './PrimaryButton';
import { tripService } from '../services/tripService';

const TRAVEL_STYLES = ['Solo', 'Couple', 'Family', 'Friends'];
const INTERESTS_LIST = [
  'Food', 'Adventure', 'Nature', 'History', 'Nightlife', 
  'Shopping', 'Culture', 'Beach', 'Luxury', 'Hidden Gems'
];

export default function TripForm() {
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [interests, setInterests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await tripService.generateTrip({
        prompt: description,
        budget,
        duration,
        travelStyle,
        interests
      });
      
      setSuccess(true);
      // Optional: clear the form on success
      // setDescription('');
      // setBudget('');
      // setDuration('');
      // setTravelers('');
      // setTravelStyle('');
      // setInterests([]);
    } catch (err) {
      setError(err.message || 'Failed to submit trip request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden mb-16">
      <div className="p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Plan Your Next Adventure</h2>
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">✓ Trip request received successfully.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextAreaField
            id="trip-description"
            label="Destination / Trip Description"
            placeholder="Example: I'm planning a 5-day trip to Japan in December with a budget of $1500. I enjoy anime, street food, temples and nature."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <InputField
              id="budget"
              label="Budget (Optional)"
              placeholder="e.g. $1500"
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
          />

          <div className="pt-4 flex justify-center sm:justify-end border-t border-gray-100">
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : '✨ Craft My Trip'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
