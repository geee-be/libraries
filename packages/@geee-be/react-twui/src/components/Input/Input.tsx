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
  ({ className, destructive, disabled, readOnly, ...otherProps }, ref) => {
    const ariaInvalid = otherProps['aria-invalid'] ?? destructive;

    return (
      <input
        ref={ref}
        aria-invalid={ariaInvalid}
        className={cn(
          'antialiased inline-flex grow rounded-lg border px-4 py-2 text-sm leading-6 transition-colors duration-100',
          disabled && 'cursor-not-allowed',
          // color
          'bg-control text-default-content border-default-500 hover:border-default-300 placeholder:text-default-content/50',
          ariaInvalid && 'border-destructive outline-destructive hover:border-destructive',
          disabled && 'bg-control text-default-content/50 placeholder:text-default-content/50 border-transparent',
          // focus
          'outline-control-focus focus:outline focus:outline-2 focus:outline-offset-2',
          className,
        )}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        {...otherProps}
      />
    );
  },
);

Input.displayName = 'Input';
