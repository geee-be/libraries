import type { VariantProps } from 'cva';
import * as React from 'react';

import { cn } from '../../helpers/utils.js';
import { CardContent } from './CardContent.js';
import { CardFooter } from './CardFooter.js';
import { CardHeader } from './CardHeader.js';
import { cardVariants } from './variants.js';

export type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & VariantProps<typeof cardVariants>;

/* ------------------------------- Components ------------------------------- */
const CardComponent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, color, variant = 'rounded', children, ...otherProps }, ref) => {
    return (
      <CardRoot ref={ref} className={cn(cardVariants({ variant, color }), className)} {...otherProps}>
        {children}
      </CardRoot>
    );
  },
);

/* Root */
const CardRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...otherProps }, ref) => {
    return (
      <div
        data-component="Card"
        ref={ref}
        className={
          cn('Card-root bg-paper rounded-xl text-paper-content border border-primary overflow-clip', className) +
          ' [&_.Card-root]:bg-paper-nested'
        }
        role="region"
        {...otherProps}
      >
        {children}
      </div>
    );
  },
);

CardComponent.displayName = 'Card';
CardRoot.displayName = 'CardRoot';

export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});
