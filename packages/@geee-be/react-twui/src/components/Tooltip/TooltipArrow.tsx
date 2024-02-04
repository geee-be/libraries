import { TooltipArrow as PrimitiveArrow } from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn, isReactElement } from '../../helpers/utils.js';
import { TippyIcon } from '../icons/index.js';

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof PrimitiveArrow>,
  React.ComponentPropsWithoutRef<typeof PrimitiveArrow>
>(
  (
    {
      className,
      children,
      asChild = children ? isReactElement(children) : children === undefined,
      width = 24,
      height = 8,
      ...props
    },
    ref,
  ) => {
    return (
      <PrimitiveArrow
        ref={ref}
        asChild={asChild}
        className={cn('text-control-solid-border', className)}
        height={height}
        viewBox="0 0 24 8"
        width={width}
        {...props}
      >
        {children ? children : <TippyIcon />}
      </PrimitiveArrow>
    );
  },
);

TooltipArrow.displayName = PrimitiveArrow.displayName;

export default TooltipArrow;
