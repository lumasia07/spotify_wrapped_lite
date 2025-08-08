'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play, Music, Heart, TrendingUp, Users, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-800 overflow-hidden pt-6">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-16 sm:w-32 h-16 sm:h-32 bg-green-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 sm:w-48 h-24 sm:h-48 bg-green-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-12 sm:w-24 h-12 sm:h-24 bg-white rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Music className="absolute top-20 left-10 sm:left-20 w-6 h-6 text-green-400 opacity-30 animate-bounce" />
        <Heart className="absolute top-40 right-16 sm:right-32 w-5 h-5 text-pink-400 opacity-30 animate-pulse" />
        <TrendingUp className="absolute bottom-32 left-16 sm:left-40 w-7 h-7 text-blue-400 opacity-30 animate-bounce delay-300" />
        <Sparkles className="absolute bottom-48 right-12 sm:right-24 w-6 h-6 text-yellow-400 opacity-30 animate-pulse delay-700" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Story Introduction */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Join 500K+ Music Lovers</span>
          </div>
        </div>

        {/* Spotify Logo */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <Image
              src="/Spotify_Primary_Logo_RGB_Green.png"
              alt="Spotify Logo"
              fill
              className="object-contain animate-pulse"
              priority
            />
          </div>
        </div>

        {/* Main Story Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Every Song Tells{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Your Story
            </span>
          </h1>
          
          {/* Story Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
            From your first play to your thousandth repeat, discover the soundtrack of your life. 
            Uncover hidden patterns, relive musical moments, and see how your taste evolved.
          </p>
        </div>

        {/* Story Points */}
        <div className="mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center sm:justify-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
            <span className="text-white text-sm sm:text-base font-medium">Your Top Tracks</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 flex-shrink-0" />
            <span className="text-white text-sm sm:text-base font-medium">Favorite Artists</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
            <span className="text-white text-sm sm:text-base font-medium">Listening Trends</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16">
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bg-green-500 hover:bg-green-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start Your Journey</span>
            </span>
            <div className={`absolute inset-0 bg-white rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-20' : 'opacity-0'}`}></div>
          </button>
          
          <button className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
            <span className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>See Demo</span>
            </span>
          </button>
        </div>

        {/* Enhanced Stats Preview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto">
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 mb-2">10M+</div>
            <div className="text-gray-400 text-xs sm:text-sm">Songs Analyzed</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-2">500K+</div>
            <div className="text-gray-400 text-xs sm:text-sm">Stories Created</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-gray-400 text-xs sm:text-sm">Music Discovery</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-400 mb-2">∞</div>
            <div className="text-gray-400 text-xs sm:text-sm">Possibilities</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
