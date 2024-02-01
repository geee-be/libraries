import { cva } from 'cva';

export const joinVariants = cva({
  base: '',
  variants: {
    shape: {
      rounded: 'rounded-lg',
      pill: 'rounded-full',
    },
  },
  defaultVariants: {
    shape: 'rounded',
  },
});
