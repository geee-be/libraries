import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type VariantProps } from 'cva';
import * as React from 'react';

import { cn } from '../../helpers/utils.js';
import TooltipArrow from './TooltipArrow.js';
import TooltipTrigger from './TooltipTrigger.js';
import { tooltipTriggerVariant, tooltipVariant } from './variants.js';

const TOOLTIP_ANIMATION_CLASSES = [
  // transform-origin
  'origin-[var(--radix-popper-transform-origin)]',

  // state animations
  'data-[side=bottom]:animate-fade-in-down data-[side=top]:animate-wg-fade-in-up data-[side=left]:animate-wg-fade-in-left data-[side=right]:animate-wg-fade-in-right data-[state=closed]:animate-wg-fade-out',

  // instant-open
  'data-[state=instant-open]:!animate-none',
];

/* ---------------------------- Tooltip Provider ---------------------------- */
type TooltipProviderElement = React.ElementRef<typeof TooltipPrimitive.Provider>;
type TooltipProviderProps = React.ComponentPropsWithRef<typeof TooltipPrimitive.Provider>;

const TooltipProvider = React.forwardRef<TooltipProviderElement, TooltipProviderProps>(
  // This component does not expect ref.
  (props, _ref) => {
    const { delayDuration = 200, skipDelayDuration = 0, ...otherProps } = props;

    return (
      <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...otherProps} />
    );
  },
);

/* ------------------------------ Tooltip Root ------------------------------ */
type TooltipRootElement = React.ElementRef<typeof TooltipPrimitive.Root>;
type TooltipRootProps = React.ComponentPropsWithRef<typeof TooltipPrimitive.Root>;

const TooltipRoot = React.forwardRef<TooltipRootElement, TooltipRootProps>(
  // This component does not expect ref.
  (props, _ref) => {
    const { delayDuration = 200, ...otherProps } = props;

    return <TooltipPrimitive.Root delayDuration={delayDuration} {...otherProps} />;
  },
);

/* ----------------------------- Tooltip Content ---------------------------- */
type TooltipContentElement = React.ElementRef<typeof TooltipPrimitive.Content>;
type TooltipContentProps = Omit<React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>, 'content'> & {
  /**
   * Whether to animate the tooltip when it opens/closes
   */
  animation?: boolean;

  /**
   * Whether to show an arrow pointing to the target element
   */
  arrow?: boolean;

  /**
   * The content to display inside the tooltip
   */
  content: React.ReactNode;
} & VariantProps<typeof tooltipVariant>;

const TooltipContent = React.forwardRef<TooltipContentElement, TooltipContentProps>((props, ref) => {
  const {
    alignOffset = -12,
    animation = true,
    arrow = true,
    arrowPadding = 12,
    children,
    content,
    className,
    collisionPadding = 12,
    sideOffset = 0,

    // variants
    size,

    ...otherProps
  } = props;

  return (
    <TooltipPrimitive.Content
      data-component="Tooltip"
      ref={ref}
      alignOffset={alignOffset}
      arrowPadding={arrowPadding}
      className={cn(tooltipVariant({ size }), animation && TOOLTIP_ANIMATION_CLASSES, className)}
      collisionPadding={collisionPadding}
      sideOffset={sideOffset}
      {...otherProps}
    >
      {children ?? content}
      {arrow ? <TooltipArrow /> : null}
    </TooltipPrimitive.Content>
  );
});

/* ----------------------------- Tooltip Component ----------------------------- */
type TooltipElement = TooltipContentElement;
type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> &
  TooltipContentProps &
  VariantProps<typeof tooltipTriggerVariant>;

const TooltipComponent = React.forwardRef<TooltipElement, TooltipProps>((props, ref) => {
  const {
    // root props
    defaultOpen,
    delayDuration = 200,
    disableHoverableContent,
    onOpenChange,
    open,

    // variants
    color,

    // trigger
    asChild,
    children,
    onClick,

    // content
    ...otherProps
  } = props;

  return (
    <TooltipProvider>
      <TooltipRoot
        defaultOpen={defaultOpen}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
        onOpenChange={onOpenChange}
        open={open}
      >
        <TooltipContent ref={ref} {...otherProps} />

        <TooltipTrigger
          asChild={asChild}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
          className={cn(tooltipTriggerVariant({ color }))}
        >
          {children}
        </TooltipTrigger>
      </TooltipRoot>
    </TooltipProvider>
  );
});

/* --------------------------------- Exports -------------------------------- */
export const Tooltip = Object.assign(TooltipComponent, {
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Portal: TooltipPrimitive.Portal,
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
});

// export default Tooltip;
