import { AddDomain } from "./AddDomain";
import { Table } from "./Table";
import { get_email_deliverability_whitelist } from "./get_email_deliverability_whitelist.query";

type Whitelist = Awaited<
  ReturnType<typeof get_email_deliverability_whitelist>
>[number];

export default async function Page({ whitelist }: { whitelist: Whitelist[] }) {
  return (
    <main class="fr-container my-12">
      <h1>Délivrabilité des domaines</h1>
      <div id="domains-deliverability-container">
        <div
          hx-get="/domains-deliverability"
          hx-select="#domains-deliverability-container"
          hx-trigger="domains-deliverability-updated"
          hx-swap="innerHTML"
        >
          <AddDomain />
          <Table whitelist={whitelist} />
        </div>
      </div>
    </main>
  );
}
