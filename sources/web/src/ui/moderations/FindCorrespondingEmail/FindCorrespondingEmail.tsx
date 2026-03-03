//

interface Props {
  website_id: string;
}

//

export function FindCorrespondingEmail(props: Props) {
  const { website_id } = props;
  const { describedby } = { describedby: "" };
  return (
    <div
      aria-describedby={describedby}
      class="m-auto my-12 flex justify-around"
    >
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
