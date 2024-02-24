import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import type { SelectGroupProps } from './Select.js';
import { Select } from './Select.js';

const meta: Meta<typeof Select> = {
  component: Select,
  decorators: (Story, ctx) => {
    const [, setArgs] = useArgs<typeof ctx.args>();

    const onValueChange = (value: string): void => {
      ctx.args.onValueChange?.(value);

      // Check if the component is controlled
      if (ctx.args.value !== undefined) {
        setArgs({ value });
      }
    };

    return (
      <div className="my-16 mx-8">
        <Story args={{ ...ctx.args, onValueChange }} />
      </div>
    );
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: SelectGroupProps[] = [
  {
    key: 'numbers',
    label: 'Numbers',
    items: [
      {
        key: 'one',
        label: 'One',
      },
      {
        key: 'two',
        label: 'Two',
      },
      {
        key: 'three',
        label: 'Three',
        disabled: true,
      },
      {
        key: 'four',
        label: 'Four',
      },
    ],
  },
];

export const Default: Story = {
  args: {
    disabled: false,
    placeholder: 'Select your value here',
    items,
  },
};
