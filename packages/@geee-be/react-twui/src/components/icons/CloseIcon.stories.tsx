import type { Meta, StoryObj } from '@storybook/react';
import { CloseIcon } from './index.js';

const meta = {
  component: CloseIcon,
  argTypes: {},
} satisfies Meta<typeof CloseIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: undefined,
    size: 24,
    title: 'Title',
  },
};
