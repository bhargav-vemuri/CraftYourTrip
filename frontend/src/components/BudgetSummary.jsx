import React from 'react';

export default function BudgetSummary({ itinerary }) {
  if (!itinerary) return null;

  // The AI provides an estimatedTotalCost and we have the user's budget
  const budget = itinerary.budget;
  const estimatedCost = itinerary.estimatedTotalCost;
  const currency = itinerary.currency || 'INR';
  const currencySymbol = currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : currency);

  const formatMoney = (num) => {
    if (!num) return `${currencySymbol}0`;
    return `${currencySymbol}${num.toLocaleString()}`;
  };

  // If no cost was estimated by the AI, we can calculate from day/stops, but assuming AI gave us something at the root level if configured
  let finalEstimatedCost = estimatedCost;
  
  if (!finalEstimatedCost) {
    let calculated = 0;
    itinerary.days?.forEach(day => {
      if (day.estimatedCost) calculated += day.estimatedCost;
      else {
        day.stops?.forEach(s => {
          if (s.estimatedCost) calculated += s.estimatedCost;
        });
      }
    });
    finalEstimatedCost = calculated;
  }

  const isOverBudget = budget && finalEstimatedCost > budget;

  return (
    <div className="relative overflow-hidden bg-zinc-900 rounded-3xl shadow-2xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-zinc-800">
      
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          Budget Intelligence
        </h3>
        <p className="text-sm text-zinc-400 mt-2 font-medium">AI-estimated costs are approximate and exclude flights.</p>
      </div>

      <div className="relative z-10 flex items-center gap-6 sm:gap-10 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
        {budget > 0 && (
          <div className="text-center sm:text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Target Budget</p>
            <p className="text-2xl font-black text-white">{formatMoney(budget)}</p>
          </div>
        )}
        
        {budget > 0 && finalEstimatedCost > 0 && (
          <div className="w-px h-12 bg-zinc-800"></div>
        )}
        
        {finalEstimatedCost > 0 && (
          <div className="text-center sm:text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Est. Total</p>
            <p className={`text-2xl font-black ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatMoney(finalEstimatedCost)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
