import React from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<BaseProps> = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md bg-white p-4 ${className}`}>{children}</div>
);

export const CardHeader: React.FC<BaseProps> = ({ children, className = "" }) => (
  <div className={`mb-2 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<BaseProps> = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

export const CardContent: React.FC<BaseProps> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export default Card;
