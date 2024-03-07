'use client';

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import * as BaseSelect from '@radix-ui/react-select';
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { Fragment, forwardRef } from 'react';
import { cn } from '../../helpers/utils.js';

export type SelectElement = HTMLButtonElement;
export type SelectProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  destructive?: boolean;
  items: SelectGroupProps[];
  onValueChange?: (value: string) => void;
  placeholder?: ReactNode;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
};

export interface SelectGroupProps {
  key: string;
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
      destructive,
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
          // focus
          'outline-control-focus focus:outline focus:outline-2 focus:outline-offset-2',
          // color
          'bg-control text-control-fg border-default hover:border-default/70 data-[placeholder]:text-control-fg/50',
          (props['aria-invalid'] ?? destructive) &&
            'border-destructive hover:border-destructive',
          disabled &&
            'bg-control text-control-fg/50 data-[placeholder]:text-control-fg/50 border-default/50 hover:border-default/50',
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
        <BaseSelect.Icon
          className={cn(
            'text-control-fg right-0 ml-4',
            disabled && 'text-transparent',
          )}
        >
          <ChevronDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Content className="overflow-hidden bg-control rounded-xl border-2 border-control-focus shadow-xl">
          <BaseSelect.ScrollUpButton className="flex items-center justify-center h-6 bg-control text-control-fg cursor-default">
            <ChevronUpIcon />
          </BaseSelect.ScrollUpButton>
          <BaseSelect.Viewport className="p-1">
            {items.map((group, groupIndex) => (
              <Fragment key={group.key}>
                {groupIndex > 0 ? (
                  <BaseSelect.Separator className="h-[1px] bg-control-fg/10 m-1" />
                ) : null}
                <BaseSelect.Group>
                  {group.label ? (
                    <BaseSelect.Label className="px-3 text-xs font-bold leading-6 bg-control/60 uppercase">
                      {group.label}
                    </BaseSelect.Label>
                  ) : null}
                  {group.items.map((item) => (
                    <SelectItem
                      key={item.key}
                      value={item.key}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </BaseSelect.Group>
              </Fragment>
            ))}
          </BaseSelect.Viewport>
          <BaseSelect.ScrollDownButton className="flex items-center justify-center h-6 bg-control text-control-fg cursor-default">
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
        'text-control-fg data-[disabled]:text-control-fg/50 data-[highlighted]:bg-control-fg/10 data-[highlighted]:text-control-fg',
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
