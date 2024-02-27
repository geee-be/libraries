import type { Meta } from '@storybook/react';
import type { FC } from 'react';
import { useEffect } from 'react';
import type { SubmitErrorHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Button } from '../Button/Button.js';
import type { SelectGroupProps } from './index.js';
import { FormSelect } from './index.js';

const meta = {
  component: FormSelect,
  argTypes: {
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof FormSelect>;

export default meta;

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

interface FormData {
  foo: string;
  bar: string;
}

export const Default: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({ mode: 'all' });

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type),
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => console.log('errors changed', errors), [errors]);

  const onSubmit = (data: FormData): void => console.log(data);
  const onInvalid: SubmitErrorHandler<FormData> = (error) =>
    console.log('submit invalid', error);

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(onSubmit, onInvalid)(event).catch(console.log);
      }}
      className="space-y-6"
    >
      <FormSelect
        control={control}
        name="foo"
        items={items}
        label="Foo"
        description="This is the foo field"
        helperText="What can we call you?"
        placeholder="Select an option"
        required="This is a hint"
      />
      <FormSelect
        control={control}
        name="bar"
        items={items}
        label="Bar"
        helperText="Not foo"
        placeholder="Select an option"
        tooltip="This field is optional"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
