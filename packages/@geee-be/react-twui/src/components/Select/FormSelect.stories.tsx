import type { Meta, StoryObj } from '@storybook/react';
import type { SelectGroupProps } from './index.js';
import { FormSelect } from './index.js';

const meta = {
  component: FormSelect,
  argTypes: {
    placeholder: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: SelectGroupProps[] = [
  {
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
    placeholder: 'This is a placeholder',
    label: 'Label',
    description: 'Description',
    helperText: 'Helper text',
    tooltip: 'Tool tip',
    required: true,
    readOnly: false,
    items,
  },
};
