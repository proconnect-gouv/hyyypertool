//

import type { HyyyperDayProps } from "#src/ui/hyyyperdays";
import { visually_hidden } from "#src/ui/visually_hidden";

//

const SUNLIGHT_CSS = `
.hyyyperday-sunlight {
  & .sky {
    height: 100%;
    inset: 0;
    pointer-events: none;
    position: fixed;
    width: 100%;
    z-index: -1;
  }

  & h1 {
    font-size: min(13.5vw, 20vh);
    line-height: 1;
  }

  &[data-painted] .title { visibility: hidden; }

  & .title {
    background-clip: text;
    background-image: linear-gradient(
      90deg,
      hsl(0 90% 60%),
      hsl(120 90% 45%),
      hsl(240 90% 60%),
      hsl(360 90% 60%)
    );
    color: transparent;
  }

  :where(.dark) & .title { text-shadow: 0 0 0.25em rgb(0 0 0 / 0.9); }
}

main:has(.hyyyperday-sunlight) {
  justify-content: space-evenly;
}

@media (min-width: 768px) and (min-height: 640px) {
  main:has(.hyyyperday-sunlight) > div:has(form) {
    zoom: 1.5;
  }
}

:where(.dark) main:has(.hyyyperday-sunlight) a {
  text-shadow: 0 0 0.4em rgb(0 0 0 / 0.95);
}
`;

//

export default function Sunlight({ assets_path, nonce }: HyyyperDayProps) {
  return (
    <div class="hyyyperday-sunlight">
      <style dangerouslySetInnerHTML={{ __html: SUNLIGHT_CSS }} nonce={nonce} />
      <canvas aria-hidden="true" class="sky"></canvas>
      <h1 class="font-bold">
        <span class={visually_hidden()}>Bonjour Hyyypertool !</span>
        <span aria-hidden="true" class="title">
          Hyyypertool
        </span>
      </h1>
      <script
        nonce={nonce}
        src={`${assets_path}/ui/hyyyperdays/2026/11/24/sunlight.client.js`}
        type="module"
      ></script>
    </div>
  );
}
