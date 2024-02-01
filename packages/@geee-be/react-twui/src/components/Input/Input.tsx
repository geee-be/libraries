import * as React from 'react';

import { cn } from '../../helpers/utils.js';

/* ---------------------------------- Types --------------------------------- */
export type InputElement = HTMLInputElement;
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  destructive?: boolean;
};

/* -------------------------------- Component ------------------------------- */
export const Input = React.forwardRef<InputElement, InputProps>(
  ({ className, destructive, disabled, ...otherProps }, ref) => {
    const ariaInvalid = otherProps['aria-invalid'] ?? destructive;

    return (
      <input
        ref={ref}
        aria-invalid={ariaInvalid}
        className={cn(
          'antialiased inline-flex grow rounded-lg border border-control-border bg-control px-4 py-2 text-sm leading-6 transition-colors duration-100 placeholder:text-control-placeholder',
          'outline-primary focus:outline focus:outline-2 focus:outline-offset-2',
          !disabled && 'text-control-content hover:border-control-border/90',
          disabled &&
            'cursor-not-allowed bg-surface-50 text-surface-300 placeholder:text-surface-300 dark:bg-white/5 dark:text-surface-200 dark:placeholder:text-surface-200',
          ariaInvalid &&
            'border-destructive outline-destructive hover:border-destructive dark:hover:border-destructive',
          !ariaInvalid && 'border-control-border',
          className,
        )}
        disabled={disabled}
        {...otherProps}
      />
    );
  },
);

Input.displayName = 'Input';
