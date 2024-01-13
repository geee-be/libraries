import type { Meta, StoryObj } from '@storybook/react';
import { TippyIcon } from './index.js';

const meta = {
  component: TippyIcon,
  argTypes: {},
} satisfies Meta<typeof TippyIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: undefined,
    size: 24,
    title: 'Title',
  },
};
