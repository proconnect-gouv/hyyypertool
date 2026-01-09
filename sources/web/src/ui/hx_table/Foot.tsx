//

import { PaginationSchema, type Pagination } from "@~/core/schema";
import { button } from "../button";
import { FrNumberConverter } from "../number";

//

export function Foot({
  colspan = 6,
  count,
  hx_query_props,
  id,
  name,
  pagination,
}: {
  colspan?: number;
  count: number;
  hx_query_props: {};
  id?: string | undefined;
  name?: string | undefined;
  pagination: Pagination;
}) {
  const { page, page_size } = pagination;
  const last_page = Math.ceil(count / page_size);
  const page_index = page - 1;

  // Distribute columns: 2 for info, remaining-1 for pagination, 1 for refresh
  const info_colspan = 2;
  const refresh_colspan = 1;
  const pagination_colspan = Math.max(1, colspan - info_colspan - refresh_colspan);

  return (
    <tfoot>
      <tr>
        <th colspan={info_colspan} class="whitespace-nowrap" scope="row">
          Affiche de {FrNumberConverter.format(page_index * page_size)}-
          {FrNumberConverter.format(page_index * page_size + page_size)} sur{" "}
          {FrNumberConverter.format(count)}
        </th>
        <td colspan={pagination_colspan}>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page <= 1}
            {...hx_query_props}
            hx-vals={JSON.stringify({ page: page - 1 } as Pagination)}
          >
            Précédent
          </button>
          <input
            {...hx_query_props}
            id={id}
            class="fr-input inline-block w-auto"
            name={name ?? PaginationSchema.keyof().enum.page}
            value={page}
          />{" "}
          <span> of {FrNumberConverter.format(last_page)}</span>
          <button
            class={button({ class: "fr-btn--tertiary-no-outline" })}
            disabled={page >= last_page}
            {...hx_query_props}
            hx-vals={JSON.stringify({ page: page + 1 } as Pagination)}
          >
            Suivant
          </button>
        </td>
        <td colspan={refresh_colspan}>
          <button class={button({ type: "tertiary" })} {...hx_query_props}>
            Rafraichir
          </button>
        </td>
      </tr>
    </tfoot>
  );
}
