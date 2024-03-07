import { cva } from 'cva';

/* -------------------------------- Variants -------------------------------- */
export const tooltipVariant = cva({
  base: 'z-50 rounded-md text-start bg-paper/100 text-paper-content border border-default/50 antialiased',
  variants: {
    size: {
      sm: 'max-w-xs px-3 py-2 text-xs',
      md: 'max-w-[350px] p-4 text-sm',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export const tooltipTriggerVariant = cva({
  variants: {
    color: {
      default: 'text-default',
      primary: 'text-primary',
      secondary: 'text-secondary',
      info: 'text-info',
      warning: 'text-warning',
      success: 'text-success',
      error: 'text-error',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});
