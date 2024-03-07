import { cva } from 'cva';

export const alertVariants = cva({
  variants: {
    variant: {
      inline: 'rounded-lg px-2 py-3 sm:items-center',
      expanded: 'gap-1 rounded-r-lg border-l-2 p-4 pl-14px',
    },
    color: {
      default:
        'border-default-muted-fg bg-default-muted text-paper-fg default-default',
      primary:
        'border-primary-muted-fg bg-primary-muted text-paper-fg default-primary',
      secondary:
        'border-secondary-muted-fg bg-secondary-muted text-paper-fg default-secondary',
      info: 'border-info-muted-fg bg-info-muted text-paper-fg default-info',
      warning:
        'border-warning-muted-fg bg-warning-muted text-paper-fg default-warning',
      success:
        'border-success-muted-fg bg-success-muted text-paper-fg default-success',
      error: 'border-error-muted-fg bg-error-muted text-paper-fg default-error',
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
      default: 'text-default-muted-fg',
      primary: 'text-primary-muted-fg',
      secondary: 'text-secondary-muted-fg',
      info: 'text-info-muted-fg',
      warning: 'text-warning-muted-fg',
      success: 'text-success-muted-fg',
      error: 'text-error-muted-fg',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

export const alertIconVariants = cva({
  variants: {
    color: {
      default: 'text-default-muted-fg',
      primary: 'text-primary-muted-fg',
      secondary: 'text-secondary-muted-fg',
      info: 'text-info-muted-fg',
      warning: 'text-warning-muted-fg',
      success: 'text-success-muted-fg',
      error: 'text-error-muted-fg',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});
