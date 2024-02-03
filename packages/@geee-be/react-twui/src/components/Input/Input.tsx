import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../helpers/utils.js';

/* ---------------------------------- Types --------------------------------- */
export type InputElement = HTMLInputElement;
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  destructive?: boolean;
};

/* -------------------------------- Component ------------------------------- */
export const Input = forwardRef<InputElement, InputProps>(
  ({ className, destructive, disabled, ...otherProps }, ref) => {
    const ariaInvalid = otherProps['aria-invalid'] ?? destructive;

    return (
      <input
        ref={ref}
        aria-invalid={ariaInvalid}
        className={cn(
          'antialiased inline-flex grow rounded-lg border border-control-border bg-control px-4 py-2 text-sm leading-6 transition-colors duration-100 placeholder:text-control-placeholder',
          'outline-primary focus:outline focus:outline-2 focus:outline-offset-2',
          ariaInvalid &&
            'border-destructive outline-destructive hover:border-destructive dark:hover:border-destructive',
          !ariaInvalid && 'border-control-border',
          !disabled && 'text-control-content hover:border-control-border/50',
          disabled &&
            'cursor-not-allowed bg-control text-control-content/50 placeholder:text-control-content/50 border-transparent',
          className,
        )}
        disabled={disabled}
        {...otherProps}
      />
    );
  },
);

Input.displayName = 'Input';
