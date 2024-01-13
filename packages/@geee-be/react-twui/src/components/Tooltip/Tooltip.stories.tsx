import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './index.js';

const meta = {
  component: Tooltip,
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'info', 'warning', 'success', 'error'],
      defaultValue: { summary: 'default' },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: 'default',
    delayDuration: 200,
    disableHoverableContent: false,
    size: 'sm',
    arrow: true,
    animation: true,
    sideOffset: 0,
    side: 'right',

    // trigger
    asChild: false,
    content: 'Tooltip content here',
  },
  decorators: [
    (Story) => (
      <span>
        <p>Line one</p>
        <p>Line two</p>
        <p>
          Line three <Story />
        </p>
      </span>
    ),
  ],
};
