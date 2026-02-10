import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { buttonStyle } from "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const BaseButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className={buttonStyle} {...rest}>
      {children}
    </button>
  );
};
