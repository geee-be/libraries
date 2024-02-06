import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardFooter, CardHeader } from './index.js';

const meta: Meta<typeof CardHeader> = {
  component: CardHeader,
  argTypes: {
    children: { control: 'object' },
    color: { control: 'select', options: ['none', 'primary', 'info', 'success', 'warning', 'error'] },
  },
  decorators: [
    (Story) => (
      <Card>
        <Story />
        <CardContent>
          <div>Hello Alert!</div>
          <div>Line 2</div>
        </CardContent>
        <CardFooter>Footer Here</CardFooter>
      </Card>
    ),
  ],
} satisfies Meta<typeof CardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Header Here!',
    color: 'none',
  },
};
