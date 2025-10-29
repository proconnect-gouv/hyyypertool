//

export function set_variables(set: any, variables: object) {
  for (const [key, value] of Object.entries(variables)) set(key, value);
}
