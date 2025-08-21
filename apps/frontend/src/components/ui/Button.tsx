import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
