import { cva } from 'cva';

export const cardVariants = cva({
  variants: {
    variant: {
      rounded: 'rounded-xl',
      'square-top': 'rounded-t-none rounded-b-xl',
    },
    color: {
      none: 'border-paper-border text-paper-content',
      primary:
        'border-paper-border text-paper-content border-t-[6px] border-t-primary',
    },
  },
  defaultVariants: {
    variant: 'rounded',
    color: 'none',
  },
});

export const cardContentVariants = cva({
  base: 'text-start font-normal space-y-6',
  variants: {
    gutters: {
      'collapse-none': 'm-6',
      'collapse-x': 'my-6 mx-0',
      'collapse-y': 'mx-6 my-0',
      collapse: 'm-0',
    },
  },
  defaultVariants: {
    gutters: 'collapse-none',
  },
});

export const cardFooterVariants = cva({
  base: 'text-start font-medium border-t border-t-paper-border',
  variants: {
    gutters: {
      'collapse-none': 'p-6',
      'collapse-x': 'py-6 px-0',
      'collapse-y': 'px-6 py-0',
      collapse: 'p-0',
    },
  },
  defaultVariants: {
    gutters: 'collapse-none',
  },
});

export const cardHeaderVariants = cva({
  base: 'text-start font-medium border-b border-b-paper-border',
  variants: {
    gutters: {
      'collapse-none': 'p-6',
      'collapse-x': 'py-6 px-0',
      'collapse-y': 'px-6 py-0',
      collapse: 'p-0',
    },
    color: {
      none: '',
      primary: 'bg-primary text-primary-content default-primary',
      secondary: 'bg-secondary text-secondary-content default-secondary',
      info: 'bg-info text-info-content default-info',
      warning: 'bg-warning text-warning-content default-warning',
      success: 'bg-success text-success-content default-success',
      error: 'bg-error text-error-content default-error',
    },
  },
  defaultVariants: {
    gutters: 'collapse-none',
    color: 'none',
  },
});
