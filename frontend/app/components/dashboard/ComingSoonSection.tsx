'use client';

interface ComingSoonSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

const ComingSoonSection = ({ 
  title = "More Features Coming Soon!",
  description = "We're working on bringing you detailed analytics, music recommendations, and sharing features.",
  className = ''
}: ComingSoonSectionProps) => {
  return (
    <div className={`text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 ${className}`}>
      <h3 className="text-white text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-300 mb-6">
        {description}
      </p>
      <div className="flex justify-center space-x-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-75"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

export default ComingSoonSection;
