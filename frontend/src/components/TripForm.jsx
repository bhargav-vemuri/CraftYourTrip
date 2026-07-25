import React, { useState } from 'react';
import TextAreaField from './TextAreaField';
import InputField from './InputField';
import TravelStyleSelect from './TravelStyleSelect';
import InterestSelector from './InterestSelector';
import PrimaryButton from './PrimaryButton';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do NOTHING except prevent page refresh as per Stage 2 requirements
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden mb-16">
      <div className="p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Plan Your Next Adventure</h2>
        
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
            <PrimaryButton type="submit">
              ✨ Craft My Trip
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
