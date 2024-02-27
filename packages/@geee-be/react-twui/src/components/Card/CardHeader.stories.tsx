import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './index.js';

const meta: Meta<typeof Card.Header> = {
  component: Card.Header,
  argTypes: {
    children: { control: 'object' },
    color: {
      control: 'select',
      options: ['none', 'primary', 'info', 'success', 'warning', 'error'],
    },
  },
  decorators: [
    (Story) => (
      <Card>
        <Story />
        <Card.Content>
          <div>Hello Alert!</div>
          <div>Line 2</div>
        </Card.Content>
        <Card.Footer>Footer Here</Card.Footer>
      </Card>
    ),
  ],
} satisfies Meta<typeof Card.Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Header Here!',
    color: 'none',
  },
};
