import { Loader2 } from "lucide-react";
import React from "react";

// Define prop types
const Button = ({
  varient = "primary",
  size = "medium",
  isLoading = false,
  children,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const varientClasses = {
    primary: "bg-blue-900 hover:bg-blue-800 active:bg-blue-900 text-white",
    secondary:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700",
  };

  const sizeClasses = {
    small: "px-3 py-1 h-8 text-sm gap-1",
    medium: "px-4 py-2 h-10 text-sm gap-2",
    large: "px-6 py-3 h-12 text-base gap-3",
  };

  // Calculate icon size based on button size
  const iconSize = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${varientClasses[varient]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className={`${iconSize[size]} animate-spin`} aria-hidden="true" />
          {children && <span className="ml-2">{children}</span>}
        </>
      ) : (
        <>
          {Icon && <Icon className={iconSize[size]} aria-hidden="true" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;