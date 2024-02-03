import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index.js';

const meta = {
  component: Input,
  argTypes: {
    placeholder: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    placeholder: 'This is a placeholder',
    // color: 'default',
  },
};
