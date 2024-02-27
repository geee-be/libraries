import type { Meta } from '@storybook/react';
import type { FC } from 'react';

const meta = {
  title: 'Tailwind CSS',
} satisfies Meta;

export default meta;

export const Dark: FC = () => (
  <div>
    <div className="dark:text-red-500">
      This should be red in dark mode only; from tw dark:
    </div>
    <div className="bg-paper">From plugin color theme</div>
  </div>
);
