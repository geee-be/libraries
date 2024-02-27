import type {
  DeepRequired,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form';

export const fieldError = (
  error:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<DeepRequired<any>[string]>>
    | undefined,
): string | null => {
  if (!error) return null;

  if (error.message) {
    if (typeof error.message === 'string') return error.message;
    return fieldError(error.message);
  }

  switch (error.type) {
    case 'max':
      return 'Too high';
    case 'maxLength':
      return 'Too long';
    case 'min':
      return 'Too low';
    case 'minLength':
      return 'Too short';
    case 'required':
      return 'Value required';
    default:
      return 'Invalid value';
  }
};
