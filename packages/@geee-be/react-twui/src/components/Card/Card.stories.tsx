import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../Alert/index.js';
import { Card } from './index.js';

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
    children: <Card.Content>Hello Alert!</Card.Content>,
    color: 'none',
    variant: 'rounded',
  },
};

export const HeaderFooter: Story = {
  args: {
    ...Default.args,
    children: (
      <>
        <Card.Header color="success">Header Here</Card.Header>
        <Card.Content>
          <div>Hello Content!</div>
          <Alert color="warning">Hello Alert!</Alert>
          <div>Line 2</div>
        </Card.Content>
        <Card.Footer>Footer Here</Card.Footer>
      </>
    ),
  },
};

export const Nested: Story = {
  args: {
    ...Default.args,
    children: (
      <Card.Content gutters="collapse-none">
        <p>Level 1</p>
        <Card>
          <Card.Content gutters="collapse-none">
            <p>Level 2</p>
            <Card>
              <Card.Content gutters="collapse-none">
                <p>Level 3</p>
                <Card>
                  <Card.Content gutters="collapse-none">
                    <p>Level 4</p>
                  </Card.Content>
                </Card>
              </Card.Content>
            </Card>
          </Card.Content>
        </Card>
      </Card.Content>
    ),
  },
};
