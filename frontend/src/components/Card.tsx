import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false, 
  ...props 
}) => {
  return (
    <div 
      className={`glass-card rounded-2xl border border-white/30 shadow-xs p-6 transition-all duration-300 ${
        hoverable ? 'hover:shadow-lg hover:border-white/50 hover:scale-[1.01] hover:-translate-y-[2px]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <p className={`text-xs text-slate-500 leading-normal ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`text-sm text-slate-700 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`mt-6 pt-4 border-t border-slate-100 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
};
