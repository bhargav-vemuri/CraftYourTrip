import React from 'react';

export function TripSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-20 animate-pulse relative">
      <div className="text-center mb-12">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 mx-auto"></div>
      </div>

      <div className="space-y-8">
        <DaySkeleton />
        <DaySkeleton />
      </div>
    </div>
  );
}

export function DaySkeleton() {
  return (
    <div className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48"></div>
      </div>
      
      <div className="space-y-4">
        <StopCardSkeleton />
        <StopCardSkeleton />
        <StopCardSkeleton />
      </div>
    </div>
  );
}

export function StopCardSkeleton() {
  return (
    <div className="relative pl-8 sm:pl-32 py-6">
      {/* Timeline line and dot */}
      <div className="absolute left-0 sm:left-24 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800"></div>
      <div className="absolute left-[-4px] sm:left-[92px] top-8 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-900"></div>
      
      {/* Time column */}
      <div className="sm:absolute sm:left-0 sm:w-20 sm:top-7 mb-2 sm:mb-0">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-12 ml-auto"></div>
      </div>

      {/* Card Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
