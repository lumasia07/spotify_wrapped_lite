'use client';

import { useState } from 'react';
import { 
  Music, 
  Mic, 
  BarChart3, 
  Share2, 
  Calendar,
  Clock,
  MapPin,
  Heart,
  Zap,
  Users,
  Sparkles
} from 'lucide-react';

const FeaturesSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const storyFeatures = [
    {
      icon: Music,
      title: "Chapter 1: Your Soundtrack",
      description: "Every year tells a story through music. Discover the songs that defined your moments, from sunrise commutes to late-night reflections.",
      color: "from-green-400 to-green-600",
      stats: "Top 50 tracks analyzed"
    },
    {
      icon: Mic, 
      title: "Chapter 2: The Artists Who Shaped You",
      description: "Meet the voices that became the narrators of your life. See how your relationship with artists evolved throughout the year.",
      color: "from-blue-400 to-blue-600",
      stats: "Artist journey mapped"
    },
    {
      icon: Clock,
      title: "Chapter 3: Time & Rhythm",
      description: "When did you listen most? How did your musical taste change with the seasons? Uncover the patterns in your daily symphonies.",
      color: "from-purple-400 to-purple-600",
      stats: "Listening patterns revealed"
    },
    {
      icon: Heart,
      title: "Chapter 4: Emotional Landscapes",
      description: "Music reflects our inner world. Explore the emotional journey of your year through the mood and energy of your music.",
      color: "from-pink-400 to-pink-600",
      stats: "Audio features analyzed"
    },
    {
      icon: MapPin,
      title: "Chapter 5: Musical Exploration",
      description: "From familiar favorites to bold new discoveries. Chart your musical adventures and see how far your taste has traveled.",
      color: "from-yellow-400 to-yellow-600",
      stats: "Genres explored"
    },
    {
      icon: Share2,
      title: "Chapter 6: Share Your Story",
      description: "Every musical journey deserves to be celebrated. Create beautiful, personalized summaries to share with the world.",
      color: "from-red-400 to-red-600",
      stats: "Stories shared globally"
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Your Musical Story in 6 Chapters</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Every Beat, Every{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Memory
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Your music tells a story that&apos;s uniquely yours. Let&apos;s turn your listening data into a beautiful narrative.
          </p>
        </div>

        {/* Features Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {storyFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative p-6 sm:p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  hoveredFeature === index ? 'border-green-500/50' : ''
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 ${
                  hoveredFeature === index ? 'opacity-10' : ''
                }`}></div>

                {/* Icon */}
                <div className="relative mb-4 sm:mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20`}>
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
                    {feature.description}
                  </p>
                  
                  {/* Stats Badge */}
                  <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                    <BarChart3 className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{feature.stats}</span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transition-opacity duration-300 ${
                  hoveredFeature === index ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </div>
            );
          })}
        </div>

        {/* Story Timeline Preview */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Your Story Timeline</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Ready to discover your musical story?
            </h3>
            
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Connect your Spotify account and watch as we transform your listening data into a beautiful, personalized narrative.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 w-full sm:w-auto">
                <span className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Begin Your Story</span>
                </span>
              </button>
              
              <button className="border border-green-500/50 text-green-400 hover:bg-green-500/10 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 w-full sm:w-auto">
                <span className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>See Examples</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
