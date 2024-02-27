export type MigrationFunction<Props> = (props: Props) => Promise<void> | void;

export interface Migrate<Props> {
  run: (props: Props) => Promise<void>;
}

export interface MigrationDef<Props> {
  idempotent?: boolean;
  up: MigrationFunction<Props>;
  down?: MigrationFunction<Props>;
}

export interface Storage {
  check: (
    fileName: string,
    digest: string,
  ) => Promise<{ applied: boolean; current: boolean }>;
  applied: (fileName: string, digest: string) => Promise<void>;
  unapplied: (fileName: string) => Promise<void>;
}
