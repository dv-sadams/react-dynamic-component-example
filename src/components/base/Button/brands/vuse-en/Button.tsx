import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { buttonClass } from "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const VuseEnButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
};
