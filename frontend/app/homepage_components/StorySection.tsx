'use client';

import { useState } from 'react';
import { 
  Play, 
  Volume2, 
  SkipForward, 
  Repeat, 
  Shuffle,
  Heart,
  TrendingUp,
  Calendar,
  Clock,
  Music,
  Headphones
} from 'lucide-react';

const StorySection = () => {
  const [activeStory, setActiveStory] = useState(0);

  const musicStories = [
    {
      title: "The Morning Ritual",
      description: "Every day starts with your go-to playlist. That first song sets the tone for everything that follows.",
      time: "6:30 AM",
      mood: "Energetic",
      icon: Calendar,
      color: "from-orange-400 to-red-500",
      tracks: ["Sunrise Vibes", "Coffee Shop Jazz", "Morning Motivation"]
    },
    {
      title: "The Commute Chronicles", 
      description: "Your journey soundtrack - from upbeat anthems to contemplative melodies that make every mile meaningful.",
      time: "8:15 AM",
      mood: "Focused",
      icon: TrendingUp,
      color: "from-blue-400 to-indigo-500",
      tracks: ["City Lights", "Highway Dreams", "Traffic Jam Blues"]
    },
    {
      title: "The Work Zone",
      description: "Focus mode activated. These instrumental tracks and ambient sounds fuel your productivity and creativity.",
      time: "10:00 AM - 5:00 PM",
      mood: "Productive",
      icon: Clock,
      color: "from-green-400 to-emerald-500",
      tracks: ["Deep Focus", "Creative Flow", "Coding Beats"]
    },
    {
      title: "The Evening Unwind",
      description: "As the day winds down, your music shifts to something softer, more reflective, preparing you for rest.",
      time: "8:00 PM",
      mood: "Relaxed",
      icon: Headphones,
      color: "from-purple-400 to-pink-500",
      tracks: ["Sunset Chill", "Nighttime Reflection", "Sleepy Melodies"]
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Music className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">A Day in Your Musical Life</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Your Daily{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Soundtrack
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            From morning motivation to evening reflection, your music shapes every moment of your day
          </p>
        </div>

        {/* Story Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Story Navigation */}
          <div className="order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6">
              {musicStories.map((story, index) => {
                const IconComponent = story.icon;
                return (
                  <div
                    key={index}
                    onClick={() => setActiveStory(index)}
                    className={`p-4 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      activeStory === index
                        ? 'bg-white/10 border-purple-500/50 shadow-2xl'
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${story.color} bg-opacity-20 flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-white text-lg sm:text-xl">
                            {story.title}
                          </h3>
                          <span className="text-xs sm:text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                            {story.time}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm sm:text-base mb-3 leading-relaxed">
                          {story.description}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-pink-400" />
                            <span className="text-xs text-gray-500">Mood: {story.mood}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Music className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-500">{story.tracks.length} tracks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Music Player Mockup */}
          <div className="order-1 lg:order-2">
            <div className="bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-700 max-w-md mx-auto">
              {/* Player Header */}
              <div className="text-center mb-6">
                <div className="text-sm text-gray-400 mb-1">Currently Playing</div>
                <div className="text-white font-semibold">{musicStories[activeStory].tracks[0]}</div>
              </div>

              {/* Album Art Placeholder */}
              <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${musicStories[activeStory].color} mb-6 flex items-center justify-center`}>
                <Music className="w-16 h-16 text-white/80" />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>1:24</span>
                  <span>3:45</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6 mb-4">
                <Shuffle className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <SkipForward className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors rotate-180" />
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                  <Play className="w-6 h-6 text-black ml-1" />
                </div>
                <SkipForward className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Repeat className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div className="bg-white h-1 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* Track List */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-sm font-medium text-gray-300 mb-3">Up Next</div>
                <div className="space-y-2">
                  {musicStories[activeStory].tracks.slice(1).map((track, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm text-gray-400">
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span>{track}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Ready to see your musical story?
            </h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Connect your Spotify account and discover the patterns, moods, and moments that make your soundtrack unique.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
              <span className="flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start My Story</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
