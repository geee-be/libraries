import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/index.js';
import { Alert } from './index.js';

const meta = {
  component: Alert,
  argTypes: {
    after: { table: { disable: true } },
    before: { table: { disable: true } },
    onClose: { table: { disable: true } },
    variant: { control: 'radio', options: ['inline', 'expanded'] },
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'info', 'warning', 'success', 'error'] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Info',
    children: 'Hello Alert!',
    variant: 'inline',
    color: 'default',
    closable: false,
  },
};

export const Primary: Story = {
  args: {
    title: 'Info',
    children: 'Hello Alert!',
    variant: 'expanded',
    color: 'primary',
    closable: false,
  },
};

export const Info: Story = {
  args: {
    title: 'Info',
    children: 'Hello Alert!',
    variant: 'expanded',
    color: 'info',
    closable: true,
  },
};

export const ButtonAfter: Story = {
  args: {
    title: 'Info',
    children: 'Hello Alert!',
    variant: 'inline',
    color: 'info',
    after: (
      <Button size="sm" variant="outline">
        Save
      </Button>
    ),
  },
};
