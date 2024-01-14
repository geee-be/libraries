import { UserIcon } from '@iconicicons/react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index.js';

const meta = {
  component: Button,
  argTypes: {
    after: { table: { disable: true } },
    before: { table: { disable: true } },
    asChild: { table: { disable: true } },
    isIconOnly: { control: 'boolean', defaultValue: { summary: false } },
    shape: { control: 'select', options: ['rounded', 'pill'], defaultValue: { summary: 'rounded' } },
    size: { control: 'select', options: ['xs-icon', 'sm', 'md'], defaultValue: { summary: 'md' } },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'info', 'warning', 'success', 'error'],
      defaultValue: { summary: 'default' },
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'transparent', 'link'],
      defaultValue: { summary: 'solid' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    color: 'default',
    variant: 'solid',
    size: 'md',
    shape: 'rounded',
    isIconOnly: false,
  },
};

export const IconBefore: Story = {
  args: {
    ...Default.args,
    before: <UserIcon />,
  },
};

export const IconAfter: Story = {
  args: {
    ...Default.args,
    after: <UserIcon />,
  },
};
