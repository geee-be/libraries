import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './index.js';

const meta = {
  component: Label,
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'info', 'warning', 'success', 'error'],
      defaultValue: { summary: 'default' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tooltip: 'Tooltip example',
    required: true,
    description: 'Description here',
    disabled: false,
    color: 'default',
    children: 'Label here',
    asChild: false,
  },
};
