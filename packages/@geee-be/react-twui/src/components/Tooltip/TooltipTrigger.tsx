import { TooltipTrigger as PrimitiveTrigger } from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn, isReactElement } from '../../helpers/utils.js';
import { InfoIcon } from '../icons/index.js';

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof PrimitiveTrigger>,
  React.ComponentPropsWithoutRef<typeof PrimitiveTrigger>
>((props, ref) => {
  const {
    children,
    asChild = children ? isReactElement(children) : children === undefined,
    className,
    onClick,
    ...otherProps
  } = props;
  return (
    <PrimitiveTrigger
      data-component="TooltipTrigger"
      ref={ref}
      asChild={asChild}
      tabIndex={-1}
      className="h-5 align-text-bottom cursor-default rounded-full"
      {...otherProps}
    >
      {children ? (
        children
      ) : (
        <span
          className={cn(
            onClick ? 'cursor-pointer' : 'cursor-default',
            'inline-flex items-center justify-center rounded-full transition-colors duration-100 focus:outline-none focus-visible:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary data-[state=instant-open]:!transition-none',
            className,
          )}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            // Allow the action on "Enter" and "Space" key
            if (e.key === 'Enter' || e.key === 'Space') {
              onClick && onClick(e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
            }
          }}
        >
          <InfoIcon size="1.25rem" className="scale-100" />
        </span>
      )}
    </PrimitiveTrigger>
  );
});

TooltipTrigger.displayName = PrimitiveTrigger.displayName;

export default TooltipTrigger;
