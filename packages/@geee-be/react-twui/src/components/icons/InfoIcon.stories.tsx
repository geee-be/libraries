import type { Meta, StoryObj } from '@storybook/react';
import { InfoIcon } from './index.js';

const meta = {
  component: InfoIcon,
  argTypes: {},
} satisfies Meta<typeof InfoIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: undefined,
    size: 24,
    title: 'Title',
  },
};
