import React from "react";
import { Loader2, Coffee, Zap, Sparkles, Clock, BarChart, TrendingUp, FileText, DollarSign, Users } from "lucide-react";

const Loader = ({
  name = "Dashboard",
  subtitle = "Preparing your data...",
  size = "default",
  variant = "spinner",
  showIcon = true,
  showPulse = true,
  className = "",
  fullScreen = true,
}) => {
  const sizeConfig = {
    small: {
      container: "w-16 h-16",
      icon: "w-8 h-8",
      text: "text-lg",
      subtitle: "text-sm",
      space: "space-y-4"
    },
    default: {
      container: "w-24 h-24",
      icon: "w-12 h-12",
      text: "text-2xl",
      subtitle: "text-base",
      space: "space-y-6"
    },
    large: {
      container: "w-32 h-32",
      icon: "w-16 h-16",
      text: "text-3xl",
      subtitle: "text-lg",
      space: "space-y-8"
    }
  };

  const variantConfig = {
    spinner: {
      icon: Loader2,
      gradient: "from-blue-500 to-blue-600",
      pulseColor: "from-blue-500 to-blue-600",
    },
    dashboard: {
      icon: BarChart,
      gradient: "from-indigo-500 to-purple-600",
      pulseColor: "from-indigo-500 to-purple-600",
    },
    invoice: {
      icon: FileText,
      gradient: "from-emerald-500 to-teal-600",
      pulseColor: "from-emerald-500 to-teal-600",
    },
    finance: {
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600",
      pulseColor: "from-green-500 to-emerald-600",
    },
    clients: {
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      pulseColor: "from-violet-500 to-purple-600",
    },
    analytics: {
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
      pulseColor: "from-orange-500 to-red-600",
    },
    zen: {
      icon: Coffee,
      gradient: "from-amber-500 to-orange-600",
      pulseColor: "from-amber-500 to-orange-600",
    },
    energy: {
      icon: Zap,
      gradient: "from-yellow-500 to-amber-600",
      pulseColor: "from-yellow-500 to-amber-600",
    },
    magic: {
      icon: Sparkles,
      gradient: "from-pink-500 to-rose-600",
      pulseColor: "from-pink-500 to-rose-600",
    },
    time: {
      icon: Clock,
      gradient: "from-slate-500 to-slate-700",
      pulseColor: "from-slate-500 to-slate-700",
    }
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];
  const Icon = currentVariant.icon;

  const loaderContent = (
    <div className={`text-center ${currentSize.space} ${className}`}>
      {showIcon && (
        <div className="relative">
          <div className={`${currentSize.container} rounded-full bg-gradient-to-r ${currentVariant.gradient} flex items-center justify-center mx-auto`}>
            <Icon className={`${currentSize.icon} text-white ${variant === 'spinner' ? 'animate-spin' : 'animate-pulse'}`} />
          </div>
          {showPulse && (
            <div className={`absolute -inset-2 bg-gradient-to-r ${currentVariant.pulseColor} rounded-full opacity-20 animate-ping`}></div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <h2 className={`${currentSize.text} font-bold text-slate-800`}>
          {name}
        </h2>
        <p className={`${currentSize.subtitle} text-slate-600`}>
          {subtitle}
        </p>
      </div>

      {/* Loading dots animation */}
      <div className="flex justify-center space-x-1 pt-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentVariant.gradient} animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

// Optional: A simple inline loader for smaller spaces
export const InlineLoader = ({
  size = "small",
  variant = "spinner",
  className = "",
}) => {
  const sizeConfig = {
    tiny: "w-4 h-4",
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-10 h-10"
  };

  const variantConfig = {
    spinner: {
      icon: Loader2,
      color: "text-blue-600",
    },
    success: {
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
    },
  };

  const currentVariant = variantConfig[variant];
  const Icon = currentVariant.icon;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Icon 
        className={`${sizeConfig[size]} ${currentVariant.color} ${variant === 'spinner' ? 'animate-spin' : ''}`} 
      />
    </div>
  );
};

// Optional: A progress loader with percentage
export const ProgressLoader = ({
  progress = 0,
  label = "Loading...",
  showPercentage = true,
  size = "default",
  variant = "spinner",
  className = "",
}) => {
  const sizeConfig = {
    small: {
      bar: "h-1",
      text: "text-xs",
      container: "space-y-2"
    },
    default: {
      bar: "h-2",
      text: "text-sm",
      container: "space-y-3"
    },
    large: {
      bar: "h-3",
      text: "text-base",
      container: "space-y-4"
    }
  };

  const variantConfig = variantConfig[variant];
  const currentSize = sizeConfig[size];

  return (
    <div className={`w-full ${currentSize.container} ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className={`${currentSize.text} text-slate-700`}>{label}</span>
          {showPercentage && (
            <span className={`${currentSize.text} font-medium text-slate-900`}>
              {Math.min(100, Math.max(0, progress))}%
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`${currentSize.bar} bg-gradient-to-r ${variantConfig.gradient} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default Loader;