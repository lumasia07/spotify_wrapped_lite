'use client';

import { useState } from 'react';
import { Users, Music2, Sparkles } from 'lucide-react';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';

interface TopItemsDisplayProps {
  className?: string;
}

const TopItemsDisplay = ({ className = '' }: TopItemsDisplayProps) => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists'>('tracks');

  const tabs = [
    {
      id: 'tracks' as const,
      label: 'Top Tracks',
      icon: Music2,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Your most played songs'
    },
    {
      id: 'artists' as const,
      label: 'Top Artists',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Your favorite musicians'
    }
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-navy-900 rounded-2xl flex items-center justify-center shadow-xl">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Your Musical Journey
            </h1>
          </div>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Discover the soundtrack of your life with personalized insights into your listening habits
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-gradient-to-br from-slate-900/50 via-navy-900/30 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Tab Navigation */}
        <div className="p-6 pb-0">
          <div className="flex bg-slate-800/50 rounded-2xl p-1.5 backdrop-blur-sm border border-slate-700/30">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 font-medium ${
                    isActive
                      ? 'text-white shadow-lg transform scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl opacity-90`} />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white/20' : 'bg-transparent'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm md:text-base">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          <div className="min-h-[600px]">
            {activeTab === 'tracks' && (
              <TopTracks 
                limit={20} 
                showTimeRangeSelector={true}
                className="bg-transparent border-none p-0"
              />
            )}
            
            {activeTab === 'artists' && (
              <TopArtists 
                limit={20} 
                showTimeRangeSelector={true}
                className="bg-transparent border-none p-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopItemsDisplay;
