import { type SVGProps } from 'react';

export type IconProps = {
  color?: string;
  size?: number | string;
  title?: string;
} & SVGProps<SVGSVGElement>;
