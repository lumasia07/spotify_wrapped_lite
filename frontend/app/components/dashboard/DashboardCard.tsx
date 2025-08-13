'use client';

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  gradient?: string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-gray-400',
  iconBgColor = 'bg-white/10',
  gradient,
  onClick,
  children,
  className = ''
}: DashboardCardProps) => {
  const baseClasses = `
    ${gradient 
      ? `bg-gradient-to-br ${gradient} backdrop-blur-sm` 
      : 'bg-white/10 backdrop-blur-sm'
    } 
    border border-white/20 rounded-xl p-6 transition-all duration-300
    ${onClick ? 'cursor-pointer hover:bg-white/15 hover:border-white/30 hover:scale-[1.02]' : ''}
    ${className}
  `;

  const CardContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 ${iconBgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      {/* Content */}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className={baseClasses}
        aria-label={`${title} - ${description}`}
      >
        <CardContent />
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      <CardContent />
    </div>
  );
};

export default DashboardCard;
