import { cva } from 'cva';

export const buttonVariants = cva({
  base: 'group inline-flex shrink-0 shadow-md select-none items-center justify-center text-sm font-semibold uppercase leading-6 transition-colors duration-100 antialiased border border-transparent focus:outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.03] hover:shadow-lg active:scale-[0.97] active:shadow-sm transition-all duration-200',
  variants: {
    size: {
      'xs-icon': 'gap-0 p-2',
      'sm-icon': 'gap-0 px-[0.66rem] py-1',
      sm: 'gap-2 px-[0.75rem] py-1',
      md: 'gap-2 px-[1rem] py-2',
    },
    shape: {
      rounded: 'rounded-lg',
      pill: 'rounded-full',
    },
    color: {
      default: 'outline-control-focus',
      primary: 'outline-primary',
      secondary: 'outline-secondary',
      info: 'outline-info',
      warning: 'outline-warning',
      success: 'outline-success',
      error: 'outline-error',
    },
    variant: {
      solid: '',
      outline: 'dark:shadow:none border shadow-xs [--border-width:1px]',
      transparent: 'bg-transparent',
      link: 'p-0 underline underline-offset-3 focus-visible:text-primary focus-visible:font-bold',
    },

    destructive: {
      true: [],
      false: [],
    },
  },

  compoundVariants: [
    {
      size: ['xs-icon', 'sm-icon'],
      class: 'rounded-full',
    },
    // default
    {
      color: 'default',
      variant: 'solid',
      class: 'bg-default text-default-fg hover:bg-default/80',
    },
    {
      color: 'default',
      variant: 'outline',
      class: 'border-default',
    },
    {
      color: 'default',
      variant: ['outline', 'transparent', 'link'],
      class: 'text-default hover:bg-default/10 dark:hover:bg-default-fg/10',
    },
    // primary
    {
      color: 'primary',
      variant: 'solid',
      class: 'bg-primary text-primary-fg hover:bg-primary/80',
    },
    {
      color: 'primary',
      variant: 'outline',
      class: 'border-primary',
    },
    {
      color: 'primary',
      variant: ['outline', 'transparent', 'link'],
      class: 'text-primary hover:bg-primary/10 dark:hover:bg-primary-fg/10',
    },
    // secondary
    {
      color: 'secondary',
      variant: 'solid',
      class: 'bg-secondary text-secondary-fg hover:bg-secondary/80',
    },
    {
      color: 'secondary',
      variant: 'outline',
      class: 'border-secondary',
    },
    {
      color: 'secondary',
      variant: ['outline', 'transparent', 'link'],
      class:
        'text-secondary hover:bg-secondary/10 dark:hover:bg-secondary-fg/20',
    },
    // info
    {
      color: 'info',
      variant: 'solid',
      class: 'bg-info text-info-fg hover:bg-info/80',
    },
    {
      color: 'info',
      variant: 'outline',
      class: 'border-info',
    },
    {
      color: 'info',
      variant: ['outline', 'transparent', 'link'],
      class: 'text-info hover:bg-info/10 dark:hover:bg-info-fg/20',
    },
    // warning
    {
      color: 'warning',
      variant: 'solid',
      class: 'bg-warning text-warning-fg hover:bg-warning/80',
    },
    {
      color: 'warning',
      variant: 'outline',
      class: 'border-warning',
    },
    {
      color: 'warning',
      variant: ['outline', 'transparent', 'link'],
      class: 'text-warning hover:bg-warning/10 dark:hover:bg-warning-fg/20',
    },
    // success
    {
      color: 'success',
      variant: 'solid',
      class: 'bg-success text-success-fg hover:bg-success/80',
    },
    {
      color: 'success',
      variant: 'outline',
      class: 'border-success',
    },
    {
      color: 'success',
      variant: ['outline', 'transparent', 'link'],
      class: 'text-success hover:bg-success/10 dark:hover:bg-success-fg/20',
    },
    // error
    {
      color: 'error',
      variant: 'solid',
      class: 'bg-error text-error-fg hover:bg-error/80',
    },
    {
      color: 'error',
      variant: 'outline',
      class: 'border-error',
    },
    {
      color: 'error',
      variant: ['outline', 'transparent', 'link'],
      class: 'text-error hover:bg-error/10 dark:hover:bg-error-fg/20',
    },
    // transparent
    {
      variant: ['transparent', 'link'],
      class: 'shadow-none',
    },
  ],
  defaultVariants: {
    shape: 'rounded',
    size: 'md',
    color: 'default',
    variant: 'solid',
  },
});

export const iconVariants = cva({
  base: 'text-current',
  variants: {
    destructive: {
      true: 'text-current',
    },
    size: {
      'xs-icon': 'h-5 w-5',
      'sm-icon': 'h-6 w-6',
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
    },
  },
  compoundVariants: [
    {
      // class: 'opacity-90',
    },
  ],
  defaultVariants: {
    size: 'md',
  },
});
