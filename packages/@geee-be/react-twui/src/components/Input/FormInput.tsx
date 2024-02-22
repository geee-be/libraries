'use client';

import type { ReactElement, ReactNode } from 'react';
import { useId } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type Message,
  type ValidationRule,
} from 'react-hook-form';
import { fieldError } from '../../helpers/field-error.js';
import { Label, type LabelProps } from '../Label/index.js';
import { type LabelHelperProps } from '../types.js';
import type { InputElement, InputProps } from './Input.js';
import { Input } from './Input.js';

/* ---------------------------------- Types --------------------------------- */
export type FormInputElement = InputElement;
// export type FormInputProps = InputProps &
//   LabelProps &
//   LabelHelperProps & {
//     destructive?: boolean;
//   };
export type FormInputProps<T extends FieldValues, Field extends FieldPath<T>> = Omit<
  InputProps & LabelProps & LabelHelperProps,
  'required' | 'min' | 'max' | 'maxLength' | 'minLength' | 'pattern'
> & {
  destructive?: boolean;
  control?: Control<T>;
  hint?: ReactNode;
  name: Field;
  label: ReactNode;
  placeholder?: ReactNode;
  // validation
  max?: ValidationRule<number | string>;
  maxLength?: ValidationRule<number>;
  min?: ValidationRule<number | string>;
  minLength?: ValidationRule<number>;
  pattern?: ValidationRule<RegExp>;
  required?: Message | ValidationRule<boolean>;
};

/* -------------------------------- Component ------------------------------- */
export const FormInput = <T extends FieldValues, Field extends FieldPath<T>>({
  className,
  control,
  description,
  destructive,
  disabled,
  helperText,
  id,
  label,
  name,
  tooltip,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  required,
  ...otherProps
}: FormInputProps<T, Field>): ReactElement => {
  const generatedId = useId();
  const elId = id ?? generatedId;
  const ariaInvalid = otherProps['aria-invalid'] ?? destructive;

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        max,
        maxLength,
        min,
        minLength,
        pattern,
        required,
      }}
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
            <Input
              id={elId}
              ref={field.ref}
              aria-describedby={helperText ? `${elId}__describer` : undefined}
              aria-invalid={ariaInvalid}
              aria-labelledby={label ? `${elId}__label` : undefined}
              destructive={!!error}
              disabled={disabled || field.disabled}
              name={name}
              {...otherProps}
              {...(field as any)}
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

FormInput.displayName = 'FormInput';
