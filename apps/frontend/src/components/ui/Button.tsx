import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

export interface ButtonProps extends MuiButtonProps {
  variant?: "default" | "outline" | "contained" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  ...props
}) => {
  const sizeMap = {
    sm: "small",
    md: "medium",
    lg: "large",
  } as const;

  let muiVariant: "contained" | "outlined" | "text" = "text";
  if (variant === "contained") muiVariant = "contained";
  else if (variant === "outline") muiVariant = "outlined";
  else if (variant === "default") muiVariant = "contained";
  else if (variant === "ghost") muiVariant = "text";

  return (
    <MuiButton variant={muiVariant} size={sizeMap[size]} {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;
