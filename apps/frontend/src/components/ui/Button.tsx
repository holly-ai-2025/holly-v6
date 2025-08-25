import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "md";
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const base = "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClass =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-indigo-600 text-white hover:bg-indigo-700";
  const sizeClass = size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4";
  return <button className={`${base} ${variantClass} ${sizeClass} ${className}`} {...props} />;
};

export default Button;
