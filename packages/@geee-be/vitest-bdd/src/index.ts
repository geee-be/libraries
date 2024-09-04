import type { Awaitable, TestAPI, TestFunction } from 'vitest';
import { describe, it } from 'vitest';

type WhenFunction<S> = (setup: S) => void;

export interface When<S> {
  (name: number | string | (() => string), fn: WhenFunction<S>): void;
  /** Only runs the tests inside this `describe` for the current file */
  only: When<S>;
  /** Skips running the tests inside this `describe` for the current file */
  skip: When<S>;
  each: WhenEach<S>;
}

type ExtractEachCallbackArgs<T extends ReadonlyArray<unknown>> = {
  1: [T[0]];
  2: [T[0], T[1]];
  3: [T[0], T[1], T[2]];
  4: [T[0], T[1], T[2], T[3]];
  5: [T[0], T[1], T[2], T[3], T[4]];
  6: [T[0], T[1], T[2], T[3], T[4], T[5]];
  7: [T[0], T[1], T[2], T[3], T[4], T[5], T[6]];
  8: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7]];
  9: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8]];
  10: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9]];
  fallback: Array<T extends ReadonlyArray<infer U> ? U : unknown>;
}[T extends Readonly<[unknown]>
  ? 1
  : T extends Readonly<[unknown, unknown]>
    ? 2
    : T extends Readonly<[unknown, unknown, unknown]>
      ? 3
      : T extends Readonly<[unknown, unknown, unknown, unknown]>
        ? 4
        : T extends Readonly<[unknown, unknown, unknown, unknown, unknown]>
          ? 5
          : T extends Readonly<
                [unknown, unknown, unknown, unknown, unknown, unknown]
              >
            ? 6
            : T extends Readonly<
                  [
                    unknown,
                    unknown,
                    unknown,
                    unknown,
                    unknown,
                    unknown,
                    unknown,
                  ]
                >
              ? 7
              : T extends Readonly<
                    [
                      unknown,
                      unknown,
                      unknown,
                      unknown,
                      unknown,
                      unknown,
                      unknown,
                      unknown,
                    ]
                  >
                ? 8
                : T extends Readonly<
                      [
                        unknown,
                        unknown,
                        unknown,
                        unknown,
                        unknown,
                        unknown,
                        unknown,
                        unknown,
                        unknown,
                      ]
                    >
                  ? 9
                  : T extends Readonly<
                        [
                          unknown,
                          unknown,
                          unknown,
                          unknown,
                          unknown,
                          unknown,
                          unknown,
                          unknown,
                          unknown,
                          unknown,
                        ]
                      >
                    ? 10
                    : 'fallback'];

export interface WhenEach<S> {
  // Exclusively arrays.
  <T extends unknown[] | [unknown]>(
    cases: ReadonlyArray<T>,
  ): (
    name: string,
    fn: (setup: S, ...args: T) => unknown,
    timeout?: number,
  ) => void;
  <T1 extends ReadonlyArray<unknown>>(
    cases: ReadonlyArray<T1>,
  ): (
    name: string,
    fn: (setup: S, ...args: ExtractEachCallbackArgs<T1>) => unknown,
    timeout?: number,
  ) => void;
  // Not arrays.
  <T2>(
    cases: ReadonlyArray<T2>,
  ): (
    name: string,
    fn: (setup: S, ...args: T2[]) => unknown,
    timeout?: number,
  ) => void;
  (
    cases: ReadonlyArray<ReadonlyArray<unknown>>,
  ): (
    name: string,
    fn: (setup: S, ...args: unknown[]) => unknown,
    timeout?: number,
  ) => void;
  (
    strings: TemplateStringsArray,
    ...placeholders: unknown[]
  ): (
    name: string,
    fn: (setup: S, arg: unknown) => unknown,
    timeout?: number,
  ) => void;
}

export const describeGiven = (name: string, fn: () => void): void => {
  describe(`GIVEN ${name}`, fn);
};

describeGiven.only = (name: string, fn: () => void) => {
  describe.only(`GIVEN ${name}`, fn);
};

const then = (name: string, thenFn: TestFunction): void => {
  it(`THEN ${name}`, thenFn);
};

then.each =
  <T>(cases: ReadonlyArray<T>) =>
  (name: string, thenFn: (...args: T[]) => Awaitable<void>) => {
    it.each(cases)(`THEN ${name}`, thenFn);
  };

then.only = (name: string, thenFn: TestFunction) => {
  it.only(`THEN ${name}`, thenFn);
};

then.skip = (name: string, thenFn: TestFunction) => {
  it.skip(`THEN ${name}`, thenFn);
};

then.todo = (name: string) => {
  it.todo(`THEN ${name}`);
};

export const given = <S>(
  name: string,
  setup: () => S,
  fn: (when: When<S>, then: TestAPI) => void,
): void => {
  describe(`GIVEN ${name}`, () => {
    const whenImpl = (name: string, whenFn: (state: S) => void): void => {
      describe(`WHEN ${name}`, () => {
        whenFn(setup());
      });
    };

    whenImpl.each =
      <T extends unknown[] | [unknown]>(cases: ReadonlyArray<T>) =>
      (name: string, whenFn: (state: S, ...args: T) => void) => {
        describe.each(cases)(`WHEN ${name}`, (...passedArgs) => {
          whenFn(setup(), ...passedArgs);
        });
      };

    whenImpl.only = (name: string, whenFn: (state: S) => void) => {
      // biome-ignore lint/suspicious/noFocusedTests: not actual test
      describe.only(`WHEN ${name}`, () => {
        whenFn(setup());
      });
    };

    whenImpl.skip = (name: string, whenFn: (state: S) => void) => {
      describe.skip(`WHEN ${name}`, () => {
        whenFn(setup());
      });
    };

    fn(whenImpl as When<S>, then as TestAPI);
  });
};

given.only = (
  name: string,
  _setup: () => unknown,
  _fn: (when: When<unknown>, then: TestAPI) => void,
) => {
  // biome-ignore lint/suspicious/noFocusedTests: not actual test
  describe.only(`GIVEN ${name}`, () => {});
};

given.skip = (
  name: string,
  _setup: () => unknown,
  _fn: (when: When<unknown>, then: TestAPI) => void,
) => {
  describe.skip(`GIVEN ${name}`, () => {});
};
