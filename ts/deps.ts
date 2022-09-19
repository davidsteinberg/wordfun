type RandomElement = { element: <T>(array: T[]) => T };
type Random = RandomElement & {
  coin: () => boolean;
  int: (low: number, high: number) => number;
};

export type { Random, RandomElement };
export { default as random } from "https://davidsteinberg.github.io/random/mod.ts";
