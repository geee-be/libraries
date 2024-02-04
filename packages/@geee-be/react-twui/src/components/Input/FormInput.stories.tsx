import type { Meta, StoryObj } from '@storybook/react';
import { FormInput } from './index.js';

const meta = {
  component: FormInput,
  argTypes: {
    placeholder: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    placeholder: 'This is a placeholder',
    label: 'Label',
    description: 'Description',
    helperText: 'Helper text',
    tooltip: (
      <div>
        <div>Tool tip</div>
        <div>goes</div>
        <div>here</div>
      </div>
    ),
    required: true,
    readOnly: false,
  },
};
