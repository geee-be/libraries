import { cva } from 'cva';

/* -------------------------------- Variants -------------------------------- */
export const tooltipVariant = cva({
  base: 'z-50 rounded-md text-start bg-paper/100 text-paper-content border border-control-border/30 antialiased',
  variants: {
    size: {
      sm: 'max-w-xs px-3 py-2 text-xs',
      md: 'max-w-[350px] p-4 text-sm',
    },
    // color: {
    //   primary: 'bg-primary',
    //   secondary: 'bg-secondary dark:text-secondary-900 ',
    //   soft: 'border border-transparent text-gray-700 shadow-overlay bg-white dark:border-surface dark:bg-neutral-800 dark:text-surface-700 dark:shadow-none',
    // },
  },
  defaultVariants: {
    size: 'sm',
    // color: 'primary',
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
