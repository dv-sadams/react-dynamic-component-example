import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import { buttonStyle } from "./Button.css";
import { getStore } from "@/helpers/getStore";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const BaseButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  const { brand } = getStore();
  return (
    <button className={buttonStyle({ brand })} {...rest}>
      {children}
    </button>
  );
};
