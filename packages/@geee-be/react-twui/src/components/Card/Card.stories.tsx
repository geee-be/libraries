import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../Alert/index.js';
import { Card, CardContent, CardFooter, CardHeader } from './index.js';

const meta = {
  component: Card,
  argTypes: {
    children: { control: 'none' },
    color: { control: 'radio', options: ['none', 'primary'] },
    variant: { control: 'radio', options: ['rounded', 'square-top'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <CardContent>Hello Alert!</CardContent>,
    color: 'none',
    variant: 'rounded',
  },
};

export const HeaderFooter: Story = {
  args: {
    ...Default.args,
    children: (
      <>
        <CardHeader color="success">Header Here</CardHeader>
        <CardContent>
          <div>Hello Content!</div>
          <Alert color="warning">Hello Alert!</Alert>
          <div>Line 2</div>
        </CardContent>
        <CardFooter>Footer Here</CardFooter>
      </>
    ),
  },
};

export const Nested: Story = {
  args: {
    ...Default.args,
    children: (
      <CardContent gutters="collapse-none">
        <p>Level 1</p>
        <Card>
          <CardContent gutters="collapse-none">
            <p>Level 2</p>
            <Card>
              <CardContent gutters="collapse-none">
                <p>Level 3</p>
                <Card>
                  <CardContent gutters="collapse-none">
                    <p>Level 4</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </CardContent>
    ),
  },
};
