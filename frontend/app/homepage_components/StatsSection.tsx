'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, Globe, Sparkles, Music } from 'lucide-react';

const StatsSection = () => {
  const [stats, setStats] = useState({
    songsAnalyzed: 0,
    usersServed: 0,
    minutesListened: 0,
    genresDiscovered: 0
  });

  // Animate numbers on component mount
  useEffect(() => {
    const finalStatsLocal = {
      songsAnalyzed: 10547832,
      usersServed: 523749,
      minutesListened: 45892341,
      genresDiscovered: 1247
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setStats({
        songsAnalyzed: Math.floor(finalStatsLocal.songsAnalyzed * easeOutQuart),
        usersServed: Math.floor(finalStatsLocal.usersServed * easeOutQuart),
        minutesListened: Math.floor(finalStatsLocal.minutesListened * easeOutQuart),
        genresDiscovered: Math.floor(finalStatsLocal.genresDiscovered * easeOutQuart)
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(finalStatsLocal);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const statsData = [
    {
      value: formatNumber(stats.songsAnalyzed),
      label: "Songs Analyzed",
      sublabel: "Every track tells a story",
      icon: Music,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    {
      value: formatNumber(stats.usersServed),
      label: "Stories Created",
      sublabel: "Music lovers worldwide",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      value: formatNumber(stats.minutesListened),
      label: "Minutes Tracked",
      sublabel: "Hours of pure musical bliss",
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      value: formatNumber(stats.genresDiscovered),
      label: "Genres Explored",
      sublabel: "From jazz to metal and beyond",
      icon: Globe,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30"
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-r from-green-900 via-black to-green-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Global Musical Impact</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            The Numbers Behind{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              The Music
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Join millions of music lovers discovering their personal soundtracks and creating lasting memories
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`text-center p-6 sm:p-8 ${stat.bgColor} backdrop-blur-sm rounded-2xl border ${stat.borderColor} hover:border-opacity-70 transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                    <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                  </div>
                </div>

                {/* Value */}
                <div className={`text-3xl sm:text-4xl md:text-5xl font-bold ${stat.color} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-gray-300 text-base sm:text-lg font-medium mb-2">
                  {stat.label}
                </div>

                {/* Sublabel */}
                <div className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Message */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Your Story Awaits</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Be part of the musical revolution
            </h3>
            
            <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-2xl mx-auto">
              Every song you&apos;ve played, every artist you&apos;ve discovered, every moment you&apos;ve shared with music - 
              it all adds up to your unique musical fingerprint.
            </p>
            
            {/* Animated dots */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-200"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-300"></div>
            </div>

            {/* CTA */}
            <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
              <span className="flex items-center justify-center space-x-2">
                <Music className="w-5 h-5" />
                <span>Discover Your Numbers</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
