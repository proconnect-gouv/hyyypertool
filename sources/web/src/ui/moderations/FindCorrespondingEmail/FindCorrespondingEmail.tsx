//

interface Props {
  email: string;
  website_id: string;
}

//

export function FindCorrespondingEmail(props: Props) {
  const { email, website_id } = props;
  const { describedby } = { describedby: "" };
  return (
    <div
      aria-describedby={describedby}
      class="m-auto my-12 flex justify-around"
    >
      <a
        href={`https://support.etalab.gouv.fr/#search/${email}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Trouver l'email correspondant dans Zammad
      </a>
      <a
        href={`https://app.crisp.chat/website/${website_id}/inbox/`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Trouver l'email correspondant dans Crisp
      </a>
    </div>
  );
}
