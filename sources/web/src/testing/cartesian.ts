//

type ValueArrays = Record<string, readonly unknown[]>;
type Cartesian<T extends ValueArrays> = { [K in keyof T]: T[K][number] };

export function cartesian<T extends ValueArrays>(inputs: T): Cartesian<T>[] {
  const keys = Object.keys(inputs) as (keyof T)[];
  return keys.reduce<Cartesian<T>[]>(
    (acc, key) =>
      acc.flatMap((combo) =>
        (inputs[key] ?? []).map((val) => ({ ...combo, [key]: val })),
      ),
    [{}] as Cartesian<T>[],
  );
}
