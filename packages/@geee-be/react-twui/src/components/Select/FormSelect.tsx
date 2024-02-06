'use client';

import type { ReactElement, ReactNode } from 'react';
import { useId } from 'react';
import type { Control, FieldPath, FieldValues, Message, ValidationRule } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { fieldError } from '../../helpers/field-error.js';
import { Label, type LabelProps } from '../Label/index.js';
import { type LabelHelperProps } from '../types.js';
import type { SelectElement, SelectGroupProps, SelectProps } from './Select.js';
import { Select } from './Select.js';

/* ---------------------------------- Types --------------------------------- */
export type FormSelectElement = SelectElement;

export type FormSelectProps<T extends FieldValues, Field extends FieldPath<T>> = Omit<
  SelectProps & LabelProps & LabelHelperProps,
  'required' | 'min' | 'max' | 'maxLength' | 'minLength' | 'pattern'
> & {
  destructive?: boolean;
  control?: Control<T>;
  hint?: ReactNode;
  name: Field;
  items: SelectGroupProps[];
  label: ReactNode;
  placeholder?: ReactNode;
  // validation
  required?: Message | ValidationRule<boolean>;
};

/* -------------------------------- Component ------------------------------- */
export const FormSelect = <T extends FieldValues, Field extends FieldPath<T>>({
  control,
  description,
  destructive,
  disabled,
  helperText,
  id,
  label,
  name,
  required,
  tooltip,
  ...otherProps
}: FormSelectProps<T, Field>): ReactElement => {
  const generatedId = useId();
  const elId = id ?? generatedId;
  const ariaInvalid = otherProps['aria-invalid'] ?? destructive;

  return (
    <Controller
      control={control}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name={name as any}
      rules={{ required }}
      disabled={disabled}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1 antialiased">
          <Label
            description={description}
            disabled={disabled}
            htmlFor={elId}
            id={`${elId}__label`}
            required={!!required}
            tooltip={tooltip}
          >
            {label}
          </Label>

          <div className="relative flex items-center">
            <Select
              id={elId}
              ref={field.ref}
              aria-describedby={helperText ? `${elId}__describer` : undefined}
              aria-invalid={ariaInvalid}
              aria-labelledby={label ? `${elId}__label` : undefined}
              destructive={!!error}
              disabled={disabled || field.disabled}
              name={name}
              onBlur={field.onBlur}
              onValueChange={(value) => field.onChange({ target: { name, value } })}
              value={field.value as string}
              {...otherProps}
            />
          </div>

          <Label.Helper aria-invalid={ariaInvalid} disabled={disabled} id={`${elId}__describer`}>
            {error && <span className="text-error mr-2">{fieldError(error)}</span>}
            <span className="">{helperText}</span>
          </Label.Helper>
        </div>
      )}
    />
  );
};

// export const FormSelect = forwardRef(FormSelectRefRender);

FormSelect.displayName = 'FormSelect';
