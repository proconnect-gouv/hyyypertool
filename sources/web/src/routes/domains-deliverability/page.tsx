import { Table } from "./Table";

export default async function Page() {
  return (
    <main class="fr-container my-12">
      <h1>Délivrabilité des domaines</h1>
      <div
        hx-get="/domains-deliverability"
        hx-select="#domains-deliverability-table"
        hx-trigger="domains-deliverability-updated"
        hx-swap="innerHTML"
      >
        <Table />
      </div>
    </main>
  );
}
