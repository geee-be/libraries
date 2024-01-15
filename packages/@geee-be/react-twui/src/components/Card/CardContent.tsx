import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import type { VariantProps } from 'cva';
import { isReactElement } from '../../helpers/utils.js';
import { cardContentVariants } from './variants.js';

/* Content */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardContentVariants>
>(({ className, children, gutters, ...props }, ref) => {
  const Component = isReactElement(children) ? Slot : 'div';

  return (
    <div data-component="CardContent" className={className}>
      <Component ref={ref} className={cardContentVariants({ gutters })} {...props}>
        {children}
      </Component>
    </div>
  );
});

CardContent.displayName = 'CardContent';
