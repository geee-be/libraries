import { forwardRef, useId } from 'react';
import { Label, type LabelProps } from '../Label/index.js';
import { type LabelHelperProps } from '../types.js';
import type { SelectElement, SelectProps } from './Select.js';
import { Select } from './Select.js';

/* ---------------------------------- Types --------------------------------- */
export type FormSelectElement = SelectElement;
export type FormSelectProps = SelectProps &
  LabelProps &
  LabelHelperProps & {
    destructive?: boolean;
  };

/* -------------------------------- Component ------------------------------- */
export const FormSelect = forwardRef<FormSelectElement, FormSelectProps>(
  ({ className, description, destructive, disabled, helperText, id, label, required, tooltip, ...otherProps }, ref) => {
    const generatedId = useId();
    const elId = id ?? generatedId;
    const ariaInvalid = otherProps['aria-invalid'] ?? destructive;

    return (
      <div className="flex flex-col antialiased">
        <Label
          description={description}
          disabled={disabled}
          htmlFor={elId}
          id={`${elId}__label`}
          required={required}
          tooltip={tooltip}
        >
          {label}
        </Label>

        <div className="relative flex items-center">
          <Select
            ref={ref}
            aria-describedby={helperText ? `${elId}__describer` : undefined}
            aria-invalid={ariaInvalid}
            aria-labelledby={label ? `${elId}__label` : undefined}
            disabled={disabled}
            id={elId}
            {...otherProps}
          />
        </div>

        <Label.Helper aria-invalid={ariaInvalid} disabled={disabled} id={`${elId}__describer`}>
          {helperText}
        </Label.Helper>
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';