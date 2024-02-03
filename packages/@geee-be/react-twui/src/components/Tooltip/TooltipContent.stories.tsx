import { Portal, Provider, Root, Trigger } from '@radix-ui/react-tooltip';
import type { Meta, StoryObj } from '@storybook/react';
import { TooltipContent } from './Tooltip.js';

const meta = {
  component: TooltipContent,
  argTypes: {},
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    arrow: true,
    animation: true,
    content: 'Tooltip content here',
  },
  decorators: (Story) => (
    <Provider>
      <Root defaultOpen={true} disableHoverableContent={true} open={true}>
        <Trigger>Tooltip</Trigger>
        <Portal>
          <Story />
        </Portal>
      </Root>
    </Provider>
  ),
};
