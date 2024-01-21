import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import type { VariantProps } from 'cva';
import { cn, isReactElement } from '../../helpers/utils.js';
import { cardHeaderVariants } from './variants.js';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
>(({ className, children, color, gutters, ...props }, ref) => {
  const Component = isReactElement(children) ? Slot : 'div';

  return (
    <div data-component="CardHeader" className={cn('Card-header', cardHeaderVariants({ color, gutters }), className)}>
      <Component ref={ref} {...props}>
        {children}
      </Component>
    </div>
  );
});

CardHeader.displayName = 'CardHeader';
