'use client';

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as BaseSelect from '@radix-ui/react-select';
import type { InputHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { Fragment, forwardRef } from 'react';
import { cn } from '../../helpers/utils.js';

export type SelectElement = HTMLButtonElement;
export type SelectProps = InputHTMLAttributes<HTMLButtonElement> & {
  items: SelectGroupProps[];
  onValueChange?: (value: string) => void;
  placeholder?: ReactNode;
  required?: boolean;
  value?: string;
};

// interface Props {
//   'aria-label'?: string;
//   'className'?: string;
//   'disabled'?: boolean;
//   'id'?: string;
//   'items': SelectGroupProps[];
//   'name'?: string;
//   'onBlur'?: React.FocusEventHandler<HTMLButtonElement>;
//   'onValueChange'?: (value: string) => void;
//   'placeholder'?: ReactNode;
//   'required'?: boolean;
//   'value'?: string;
// }

export interface SelectGroupProps {
  label?: ReactNode;
  items: SelectItemProps[];
}

export interface SelectItemProps {
  key: string;
  label: ReactNode;
  disabled?: boolean;
}

export const Select = forwardRef<SelectElement, SelectProps>(
  (
    {
      'aria-label': ariaLabel,
      className,
      disabled,
      id,
      items,
      name,
      onBlur,
      onValueChange,
      placeholder,
      readOnly,
      required,
      value,
      type,
      ...props
    },
    ref,
  ) => (
    <BaseSelect.Root
      name={name}
      value={value}
      disabled={disabled || readOnly}
      onValueChange={onValueChange}
      required={required}
    >
      <BaseSelect.Trigger
        {...props}
        id={id}
        name={id}
        className={cn(
          'antialiased inline-flex justify-between grow rounded-lg items-center border px-4 py-2 text-sm leading-6 transition-colors duration-100',
          disabled && 'cursor-not-allowed',
          // color
          'bg-control text-control-content border-default-500 hover:border-default-300 data-[placeholder]:text-control-content/50',
          disabled &&
            'bg-control text-control-content/50 data-[placeholder]:text-control-content/50 border-transparent',
          // focus
          'outline-control-focus focus:outline focus:outline-2 focus:outline-offset-2',
          className,
        )}
        aria-label={ariaLabel}
        disabled={disabled}
        onBlur={onBlur}
        ref={ref}
      >
        <div className="min-w-0 truncate">
          <BaseSelect.Value placeholder={placeholder} />
        </div>
        <BaseSelect.Icon className={cn('text-control-content right-0 ml-4', disabled && 'text-transparent')}>
          <ChevronDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Content className="overflow-hidden bg-control rounded-xl border-2 border-control-focus shadow-xl">
          <BaseSelect.ScrollUpButton className="flex items-center justify-center h-6 bg-control text-control-content cursor-default">
            <ChevronUpIcon />
          </BaseSelect.ScrollUpButton>
          <BaseSelect.Viewport className="p-1">
            {items.map((group, groupIndex) => (
              <Fragment key={groupIndex}>
                {groupIndex > 0 ? <BaseSelect.Separator className="h-[1px] bg-control-content/10 m-1" /> : null}
                <BaseSelect.Group>
                  {group.label ? (
                    <BaseSelect.Label className="px-3 text-xs font-bold leading-6 bg-control/60 uppercase">
                      {group.label}
                    </BaseSelect.Label>
                  ) : null}
                  {group.items.map((item) => (
                    <SelectItem key={item.key} value={item.key} disabled={item.disabled}>
                      {item.label}
                    </SelectItem>
                  ))}
                </BaseSelect.Group>
              </Fragment>
            ))}
          </BaseSelect.Viewport>
          <BaseSelect.ScrollDownButton className="flex items-center justify-center h-6 bg-control text-control-content cursor-default">
            <ChevronDownIcon />
          </BaseSelect.ScrollDownButton>
        </BaseSelect.Content>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  ),
);

Select.displayName = 'Select';

const SelectItem = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ className?: string; disabled?: boolean; value: string }>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <BaseSelect.Item
      className={cn(
        'cursor-pointer leading-none text-sm rounded-lg flex items-center h-[45px] pr-[35px] pl-6 relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none',
        // colors
        'text-control-content data-[disabled]:text-control-content/50 data-[highlighted]:bg-control-content/10 data-[highlighted]:text-control-content',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
        <CheckIcon />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
});
