import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button.js';
import { Input } from '../Input/Input.js';
import { Join } from './index.js';

const meta = {
  component: Join,
  argTypes: {
    children: { table: { disable: true } },
    shape: { control: 'select', options: ['rounded', 'pill'], defaultValue: { summary: 'rounded' } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Join>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Input className="join-item" />
        <Button className="join-item" color="success">
          Button
        </Button>
      </>
    ),
    shape: 'rounded',
  },
};

export const OutlineButton: Story = {
  args: {
    children: (
      <>
        <Input className="join-item" />
        <Button className="join-item" variant="outline">
          Button
        </Button>
      </>
    ),
    shape: 'pill',
  },
};

export const MultiLine: Story = {
  args: {
    children: (
      <>
        <Input className="join-item" />
        <Button className="join-item" color="success">
          Button
        </Button>
      </>
    ),
    shape: 'rounded',
  },
};