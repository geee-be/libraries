import * as React from 'react';

import { type IconProps } from './types.js';

export const RequiredIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { size = 24, title, ...rest } = props;
  const titleId = title ? `wg-${Date.now()}-${Math.floor(Math.random() * 10000)}` : undefined;

  return (
    <svg
      ref={ref}
      aria-labelledby={titleId}
      fill="currentColor"
      height={size}
      viewBox="0 0 32 32"
      width={size}
      {...rest}
    >
      {title && <title id={titleId}>{title}</title>}
      <path d="M1.728 20.992q-0.416 1.6 0.416 3.008 0.832 1.44 2.432 1.856t3.040-0.384q0.832-0.48 2.56-1.92t3.168-2.912q-0.608 2.016-0.96 4.192t-0.384 3.168q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848q0-0.96-0.384-3.168t-0.928-4.192q1.44 1.504 3.168 2.944t2.528 1.888q1.44 0.832 3.040 0.384t2.432-1.856 0.416-3.008-1.888-2.464q-0.864-0.48-2.944-1.248t-4.064-1.28q2.016-0.512 4.096-1.28t2.912-1.248q1.44-0.832 1.888-2.432t-0.416-3.040q-0.832-1.44-2.432-1.856t-3.040 0.384q-0.832 0.512-2.528 1.92t-3.168 2.912q0.576-1.984 0.928-4.192t0.384-3.168q0-1.632-1.184-2.816t-2.816-1.184-2.816 1.184-1.184 2.816q0 0.992 0.384 3.168t0.96 4.192q-1.44-1.472-3.168-2.88t-2.56-1.952q-1.44-0.8-3.040-0.384t-2.432 1.856-0.416 3.040 1.888 2.432q0.832 0.48 2.912 1.248t4.128 1.28q-2.016 0.512-4.096 1.28t-2.944 1.248q-1.44 0.832-1.888 2.464z"></path>
    </svg>
  );
});

RequiredIcon.displayName = 'RequiredIcon';
