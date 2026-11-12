/* @jsxImportSource preact */

export function SelectAllMembers() {
  return (
    <input
      aria-label="Sélectionner tous les membres"
      type="checkbox"
      onChange={(event) => {
        const { checked } = event.currentTarget;
        event.currentTarget
          .closest("table")
          ?.querySelectorAll<HTMLInputElement>('input[name="user_id"]')
          .forEach((input) => {
            input.checked = checked;
          });
      }}
    />
  );
}
