import type { Meta } from '@storybook/react';
import type { FC } from 'react';
import { useEffect } from 'react';
import type { SubmitErrorHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Button } from '../Button/Button.js';
import { FormInput } from './FormInput.js';

const meta = {
  component: FormInput,
} satisfies Meta<typeof FormInput>;

export default meta;

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
  } = useForm<FormData>({
    mode: 'all',
    defaultValues: { foo: 'foobar', bar: '' },
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type),
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => console.log('errors changed', errors), [errors]);

  const onSubmit = (data: FormData): void => console.log('submit', data);
  const onInvalid: SubmitErrorHandler<FormData> = (error) =>
    console.log('submit invalid', error);

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(onSubmit, onInvalid)(event).catch(console.log);
      }}
      className="space-y-6"
    >
      <FormInput
        control={control}
        name="foo"
        label="Foo"
        helperText="What can we call you?"
        required="Foo is important. You must give a value."
        minLength={5}
      />
      <FormInput
        control={control}
        name="bar"
        label="Bar"
        helperText="Gotta sound official"
        minLength={5}
        pattern={{ value: /^[qwerty]+$/, message: 'Wrong letters' }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
