import { AddDomain } from "./AddDomain";
import { Table } from "./Table";

export default async function Page() {
  return (
    <main class="fr-container my-12" id="domains-deliverability-container">
      <h1>Délivrabilité des domaines</h1>
      <div
        hx-get="/domains-deliverability"
        hx-select="#domains-deliverability-container"
        hx-trigger="domains-deliverability-updated"
        hx-swap="innerHTML"
      >
        <Table />
        <AddDomain />
      </div>
    </main>
  );
}
