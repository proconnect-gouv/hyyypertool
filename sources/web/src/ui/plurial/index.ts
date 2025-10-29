//

export const FrCardinalRules = new Intl.PluralRules("fr-FR");

//

export function formattedPlural<TOne extends string, TOther extends string>(
  value: number,
  { one, other }: { one: TOne; other: TOther },
) {
  return FrCardinalRules.select(value) === "one" ? one : other;
}
