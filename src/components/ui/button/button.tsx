import * as React from "react";
import "@/components/ui/button/button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClass = {
      default: "button-default",
      outline: "button-outline",
    };

    return (
      <button
        ref={ref}
        className={`button-base ${variantClass[variant]} ${className || ""}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
