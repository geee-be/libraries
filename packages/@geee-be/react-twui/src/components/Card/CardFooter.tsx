import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import type { VariantProps } from 'cva';
import { cn, isReactElement } from '../../helpers/utils.js';
import { cardFooterVariants } from './variants.js';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardFooterVariants>
>(({ className, children, gutters, ...props }, ref) => {
  const Component = isReactElement(children) ? Slot : 'div';

  return (
    <div data-component="CardFooter" className={cn('Card-footer', cardFooterVariants({ gutters }), className)}>
      <Component ref={ref} {...props}>
        {children}
      </Component>
    </div>
  );
});

CardFooter.displayName = 'CardFooter';
