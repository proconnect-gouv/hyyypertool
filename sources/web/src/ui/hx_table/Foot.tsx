//

import { Pagination_Schema, type Pagination } from "@~/core/schema";
import { button } from "../button";
import { FrNumberConverter } from "../number";

//

export function Foot({
  count,
  hx_query_props,
  id,
  name,
  pagination,
}: {
  count: number;
  hx_query_props: {};
  id?: string | undefined;
  name?: string | undefined;
  pagination: Pagination;
}) {
  const { page, page_size } = pagination;
  const last_page = Math.ceil(count / page_size);
  const page_index = page - 1;

  return (
    <tfoot>
      <tr>
        <th colspan={2} class="whitespace-nowrap" scope="row">
          Affiche de {FrNumberConverter.format(page_index * page_size)}-
          {FrNumberConverter.format(page_index * page_size + page_size)} sur{" "}
          {FrNumberConverter.format(count)}
        </th>
        <td colspan={3}>
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
            name={name ?? Pagination_Schema.keyof().enum.page}
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
        <td>
          <button class={button({ type: "tertiary" })} {...hx_query_props}>
            Rafraichir
          </button>
        </td>
      </tr>
    </tfoot>
  );
}
