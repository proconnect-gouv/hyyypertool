export const fr_cardinal_rules = new Intl.PluralRules("fr-FR");
//

//

export function formattedPlural<TOne extends string, TOther extends string>(
  value: number,
  { one, other }: { one: TOne; other: TOther },
) {
  return fr_cardinal_rules.select(value) === "one" ? one : other;
}
