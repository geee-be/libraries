import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

import { cn, isElementWithChildren, isReactElement } from '../../helpers/utils.js';
import { Tooltip } from '../Tooltip/index.js';
import { RequiredIcon } from '../icons/RequiredIcon.js';

/* ---------------------------------- Types --------------------------------- */
export type LabelElement = React.ElementRef<typeof LabelPrimitive.Root>;
export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  /** Tooltip text to display when hovering over the label */
  tooltip?: React.ReactNode;

  /** Additional description text, shown next to the primary label */
  description?: React.ReactNode;

  /** Indicates if the label is associated with a required field */
  required?: boolean;

  /** Indicates if the label is associated with a disabled field */
  disabled?: boolean;
};

/* -------------------------------- Component ------------------------------- */
const LabelWedges = React.forwardRef<LabelElement, LabelProps>(
  ({ asChild = false, children, className, description, disabled, required = false, tooltip, ...otherProps }, ref) => {
    const useAsChild = asChild && isReactElement(children);

    const innerContent = useAsChild ? (
      React.cloneElement(children, {
        children: (
          <>
            {isElementWithChildren(children) && children.props.children}
            {required && (
              <span className="text-error">
                <RequiredIcon size="0.7em" />
              </span>
            )}
          </>
        ),
      })
    ) : (
      <>
        {children ? <span>{children}</span> : null}

        {description ? (
          <span className={cn('font-normal text-paper-content/70', disabled && 'text-paper-content/50')}>
            {description}
          </span>
        ) : null}

        {required ? (
          <span className="text-error">
            <RequiredIcon size="0.7em" />
          </span>
        ) : null}
      </>
    );

    if (!children && !tooltip && !description) {
      return null;
    }

    return (
      <div className="wg-label inline-flex items-center gap-1 wg-antialiased">
        <LabelPrimitive.Root
          ref={ref}
          asChild={useAsChild}
          className={cn(
            'wg-label inline-flex cursor-pointer items-center gap-1 text-sm font-medium leading-6',
            disabled && 'pointer-events-none text-surface-300',
            className,
          )}
          {...otherProps}
        >
          {innerContent}
        </LabelPrimitive.Root>

        {tooltip ? <Tooltip content={tooltip} /> : null}
      </div>
    );
  },
);

const HelperText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { error?: boolean; disabled?: boolean }
>(({ children, error, disabled, className, ...otherProps }, ref) => {
  const HelperTextComponent = children && isReactElement(children) ? Slot : 'span';
  const ariaInvalid = otherProps['aria-invalid'];

  return children ? (
    <HelperTextComponent
      ref={ref}
      className={cn(
        'wg-label__helper text-start text-sm leading-6 text-paper-content/70 wg-antialiased',
        (ariaInvalid ?? error) && 'text-destructive',
        disabled && 'text-paper-content/50',
        className,
      )}
      role={ariaInvalid ? 'alert' : undefined}
      {...otherProps}
    >
      {children}
    </HelperTextComponent>
  ) : null;
});

LabelWedges.displayName = 'Label';
HelperText.displayName = 'HelperText';

const Label = Object.assign(LabelWedges, {
  Helper: HelperText,
});

export default Label;
