//

import type { HyyyperDayProps } from "#src/ui/hyyyperdays";
import { visually_hidden } from "#src/ui/visually_hidden";

//

const BURST_FROM = Array(12).fill("0 0 0 0 currentColor").join(", ");
const BURST_TO = [
  [48, 0],
  [41.6, 24],
  [24, 41.6],
  [0, 48],
  [-24, 41.6],
  [-41.6, 24],
  [-48, 0],
  [-41.6, -24],
  [-24, -41.6],
  [0, -48],
  [24, -41.6],
  [41.6, -24],
]
  .map(([x, y]) => `${x}px ${y}px 0 0 currentColor`)
  .join(", ");

const TRICOLORE_CSS = `
.hyyyperday-tricolore {
  padding: 2.5rem 3rem;
  position: relative;

  & .word {
    -webkit-text-stroke: 1px #161616;
    animation: hyyyperday-tricolore-wave 2.4s ease-out both;
    background-clip: text;
    background-image: linear-gradient(
      100deg,
      #000091 0 33%,
      #f5f5fe 33% 66%,
      #e1000f 66% 100%
    );
    background-position: 100% 0;
    background-size: 100% 100%;
    color: transparent;
  }

  & .firework {
    animation: hyyyperday-tricolore-boom 1.4s ease-out 3 both;
    border-radius: 50%;
    height: 6px;
    position: absolute;
    width: 6px;

    &.blue { color: #000091; left: 0; top: 0; }
    &.red { animation-delay: 450ms; color: #e1000f; right: 0; top: 10%; }
    &.silver { animation-delay: 900ms; color: #929292; left: 50%; top: -20%; }
  }
}

@keyframes hyyyperday-tricolore-wave {
  from { background-size: 300% 100%; }
}

@keyframes hyyyperday-tricolore-boom {
  from { box-shadow: ${BURST_FROM}; opacity: 1; }
  70% { opacity: 1; }
  to { box-shadow: ${BURST_TO}; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hyyyperday-tricolore,
  .hyyyperday-tricolore * {
    animation: none !important;
  }

  .hyyyperday-tricolore .firework {
    display: none;
  }
}
`;

//

export default function Tricolore({ nonce }: HyyyperDayProps) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: TRICOLORE_CSS }}
        nonce={nonce}
      />
      <h1 class="hyyyperday-tricolore text-5xl font-bold">
        <span class={visually_hidden()}>Vive le 14 juillet, Hyyypertool !</span>
        <span aria-hidden="true" class="firework blue"></span>
        <span aria-hidden="true" class="firework red"></span>
        <span aria-hidden="true" class="firework silver"></span>
        <span aria-hidden="true" class="word">
          Hyyypertool
        </span>
      </h1>
    </>
  );
}
