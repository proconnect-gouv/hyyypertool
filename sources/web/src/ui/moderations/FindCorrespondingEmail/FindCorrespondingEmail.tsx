//

import { CRISP_APP_BASE_URL, create_link } from "#src/lib/crisp";

interface Props {
  describedby: string;
  website_id: string;
}

//

export function FindCorrespondingEmail(props: Props) {
  const { describedby, website_id } = props;
  return (
    <div
      aria-describedby={describedby}
      class="m-auto my-12 flex justify-around"
    >
      <a
        href={create_link({
          base_url: CRISP_APP_BASE_URL,
          website_id,
        }).inbox()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Trouver l'email correspondant dans Crisp
      </a>
    </div>
  );
}
