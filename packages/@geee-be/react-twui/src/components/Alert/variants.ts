import { cva } from 'cva';

export const alertVariants = cva({
  variants: {
    variant: {
      inline: 'rounded-lg px-2 py-3 sm:items-center',
      expanded: 'gap-1 rounded-r-lg border-l-2 p-4 pl-14px',
    },
    color: {
      default: 'border-default-border bg-default-soft text-paper-content',
      primary: 'border-primary-border bg-primary-soft text-paper-content',
      secondary: 'border-secondary-border bg-secondary-soft text-paper-content',
      info: 'border-info-border bg-info-soft text-paper-content',
      warning: 'border-warning-border bg-warning-soft text-paper-content ',
      success: 'border-success-border bg-success-soft text-paper-content',
      error: 'border-error-border bg-error-soft text-paper-content',
    },
  },
  defaultVariants: {
    variant: 'inline',
    color: 'default',
  },
});

export const alertTitleVariants = cva({
  base: 'text-start font-bold',
  variants: {
    color: {
      default: 'text-default-soft-content dark:text-primary',
      primary: 'text-primary-soft-content',
      secondary: 'text-secondary-soft-content',
      info: 'text-info-soft-content',
      warning: 'text-warning-soft-content',
      success: 'text-success-soft-content',
      error: 'text-error-soft-content',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

export const alertIconVariants = cva({
  variants: {
    color: {
      default: 'text-default-soft-content',
      primary: 'text-primary-soft-content',
      secondary: 'text-secondary-soft-content',
      info: 'text-info-soft-content',
      warning: 'text-warning-soft-content',
      success: 'text-success-soft-content',
      error: 'text-error-soft-content',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});
