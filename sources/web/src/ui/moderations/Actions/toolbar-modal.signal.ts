import { signal } from "@preact/signals";

export const toolbar_open = signal<"accept" | "refusal" | null>(null);
