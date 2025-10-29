//

export function date_to_string(date: Date | undefined | null) {
  return date
    ? `${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString("fr-FR")} `
    : "";
}

export function date_to_dom_string(date: Date | undefined | null) {
  return date ? date.toLocaleDateString("en-CA") : "";
}
