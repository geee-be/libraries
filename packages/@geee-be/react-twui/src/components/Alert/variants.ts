import { cva } from 'cva';

export const alertVariants = cva({
  variants: {
    variant: {
      inline: 'rounded-lg px-2 py-3 sm:items-center',
      expanded: 'gap-1 rounded-r-lg border-l-2 p-4 pl-14px',
    },
    color: {
      default:
        'border-default-soft-fg bg-default-soft text-paper-fg default-default',
      primary:
        'border-primary-soft-fg bg-primary-soft text-paper-fg default-primary',
      secondary:
        'border-secondary-soft-fg bg-secondary-soft text-paper-fg default-secondary',
      info: 'border-info-soft-fg bg-info-soft text-paper-fg default-info',
      warning:
        'border-warning-soft-fg bg-warning-soft text-paper-fg default-warning',
      success:
        'border-success-soft-fg bg-success-soft text-paper-fg default-success',
      error: 'border-error-soft-fg bg-error-soft text-paper-fg default-error',
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
      default: 'text-default-soft-fg',
      primary: 'text-primary-soft-fg',
      secondary: 'text-secondary-soft-fg',
      info: 'text-info-soft-fg',
      warning: 'text-warning-soft-fg',
      success: 'text-success-soft-fg',
      error: 'text-error-soft-fg',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

export const alertIconVariants = cva({
  variants: {
    color: {
      default: 'text-default-soft-fg',
      primary: 'text-primary-soft-fg',
      secondary: 'text-secondary-soft-fg',
      info: 'text-info-soft-fg',
      warning: 'text-warning-soft-fg',
      success: 'text-success-soft-fg',
      error: 'text-error-soft-fg',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});
