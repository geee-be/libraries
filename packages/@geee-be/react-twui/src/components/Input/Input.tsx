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
          // focus
          'outline-control-focus focus:outline focus:outline-2 focus:outline-offset-2',
          // color
          'bg-control text-control-content border-default hover:border-default/70 placeholder:text-control-content/50',
          ariaInvalid && 'border-destructive hover:border-destructive',
          disabled &&
            'bg-control text-control-content/50 placeholder:text-control-content/50 border-default/50 hover:border-default/50',
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
