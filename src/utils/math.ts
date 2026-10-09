// Injectable so tests can force specific rolls instead of stubbing Math.random.
export type Rng = () => number;

// A plain `Math.random` alias would freeze in the *current* function
// reference, so stubbing Math.random later (e.g. sinon in tests) wouldn't
// affect anything already holding this default. Wrapping it defers the
// lookup to call time instead.
export const defaultRng: Rng = () => Math.random();

export const randomInt = (
  min: number,
  max: number,
  rng: Rng = defaultRng,
): number => {
  return Math.floor(rng() * (max - min + 1) + min);
};

export const range = (start: number, length: number): number[] => {
  return Array.from({ length }, (_, i) => start + i);
};
