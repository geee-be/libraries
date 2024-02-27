type ErrorCallback = (err: Error) => void;
type DataCallback<T> = (err: undefined, result: T) => void;
export type Callback<T> = DataCallback<T> & ErrorCallback;

export const promiseToCallback = <T>(
  promise: Promise<T>,
  cb: Callback<T>,
): Promise<void> => {
  return promise.then(
    (res) => {
      setImmediate(() => {
        // eslint-disable-next-line promise/no-callback-in-promise
        cb(undefined, res);
      });
      return undefined;
    },
    (err: Error) => {
      setImmediate(() => {
        // eslint-disable-next-line promise/no-callback-in-promise
        cb(err);
      });
    },
  );
};
