import { cva } from 'cva';

export const alertVariants = cva({
  variants: {
    variant: {
      inline: 'rounded-lg px-2 py-3 sm:items-center',
      expanded: 'gap-1 rounded-r-lg border-l-2 p-4 pl-14px',
    },
    color: {
      default:
        'border-default-border bg-default-soft text-paper-content default-default',
      primary:
        'border-primary-border bg-primary-soft text-paper-content default-primary',
      secondary:
        'border-secondary-border bg-secondary-soft text-paper-content default-secondary',
      info: 'border-info-border bg-info-soft text-paper-content default-info',
      warning:
        'border-warning-border bg-warning-soft text-paper-content default-warning',
      success:
        'border-success-border bg-success-soft text-paper-content default-success',
      error:
        'border-error-border bg-error-soft text-paper-content default-error',
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
