export const normalize = (value: string | null | undefined) =>
  (value ?? "").replace(/\s+/g, " ").replace(/[’‘]/g, "'").trim();
