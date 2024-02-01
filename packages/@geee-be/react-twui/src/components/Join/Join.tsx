import type { VariantProps } from 'cva';
import type { FC, PropsWithChildren } from 'react';
import { cn } from '../../helpers/utils.js';
import './join.css';
import { joinVariants } from './variants.js';

export type JoinElement = HTMLDivElement;
export type JoinProps = PropsWithChildren & VariantProps<typeof joinVariants> & { className?: string };

export const Join: FC<JoinProps> = ({ children, className, shape }) => (
  <div className={cn('join', joinVariants({ shape }), className)}>{children}</div>
);
