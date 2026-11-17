//

import type { HyyyperDayProps } from "#src/ui/hyyyperdays";
import { visually_hidden } from "#src/ui/visually_hidden";

//

const NOEL_CSS = `
.hyyyperday-noel {
  isolation: isolate;
  padding: 2rem 3rem 1.5rem;
  position: relative;

  & .snow {
    animation: hyyyperday-noel-snow 14s linear infinite;
    background-image:
      radial-gradient(4px 4px at 20px 30px, #a6b8f2 50%, transparent 55%),
      radial-gradient(3px 3px at 90px 130px, #cacafb 50%, transparent 55%),
      radial-gradient(2px 2px at 160px 70px, #a6b8f2 50%, transparent 55%),
      radial-gradient(3px 3px at 210px 170px, #cacafb 50%, transparent 55%);
    background-size: 240px 200px;
    inset: -3rem -6rem;
    mask-image: radial-gradient(closest-side, #000 55%, transparent);
    pointer-events: none;
    position: absolute;
    z-index: -1;
  }

  & .h {
    display: inline-block;
    position: relative;
  }

  & .hat {
    animation: hyyyperday-noel-hat-drop 900ms cubic-bezier(0.34, 1.56, 0.64, 1) 300ms both;
    height: 0.8em;
    left: -0.35em;
    position: absolute;
    rotate: -18deg;
    top: -0.6em;
    width: 1em;
  }

  & .y {
    animation: hyyyperday-noel-swing 1.2s ease-in-out 3 alternate;
    display: inline-block;
    transform-origin: 50% 0;

    &:nth-child(3) { animation-delay: 150ms; }
    &:nth-child(4) { animation-delay: 300ms; }
  }

  & .per {
    color: #fff;
    text-shadow: 0 0 4px #000;
  }

  & .garland {
    animation: hyyyperday-noel-twinkle 1.6s steps(2) infinite;
    background-image:
      radial-gradient(circle, #e1000f 0 4px, transparent 5px),
      radial-gradient(circle, #ffca00 0 4px, transparent 5px),
      radial-gradient(circle, #000091 0 4px, transparent 5px);
    background-position: 0 0, 16px 0, 32px 0;
    background-repeat: repeat-x;
    background-size: 48px 12px;
    display: block;
    height: 12px;
    margin-top: 0.5rem;
  }
}

@keyframes hyyyperday-noel-snow {
  from { background-position: 0 -200px, 20px -200px, -10px -200px, 30px -200px; }
  to { background-position: 40px 200px, 0 200px, 30px 200px, -20px 200px; }
}

@keyframes hyyyperday-noel-hat-drop {
  from { opacity: 0; translate: 0 -2em; rotate: 25deg; }
}

@keyframes hyyyperday-noel-swing {
  from { rotate: -12deg; }
  to { rotate: 12deg; }
}

@keyframes hyyyperday-noel-twinkle {
  50% { opacity: 0.55; }
}

@media (prefers-reduced-motion: reduce) {
  .hyyyperday-noel,
  .hyyyperday-noel * {
    animation: none !important;
  }
}
`;

//

export default function Noel({ nonce }: HyyyperDayProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NOEL_CSS }} nonce={nonce} />
      <h1 class="hyyyperday-noel text-5xl font-bold">
        <span class={visually_hidden()}>Joyeux Noël Hyyypertool !</span>
        <span aria-hidden="true" class="snow"></span>
        <span aria-hidden="true">
          <span class="h text-blue-france">
            H
            <svg class="hat" viewBox="0 0 64 48">
              <path d="M6 38 C14 14 34 2 52 10 L58 30 Z" fill="#e1000f" />
              <circle cx="57" cy="30" fill="#fff" r="6" stroke="#ddd" />
              <rect
                fill="#fff"
                height="12"
                rx="6"
                stroke="#ddd"
                width="46"
                x="2"
                y="34"
              />
            </svg>
          </span>
          <span class="y text-blue-france">y</span>
          <span class="y text-blue-france">y</span>
          <span class="y text-blue-france">y</span>
          <span class="per">per</span>
          <span class="text-red-marianne">tool</span>
        </span>
        <span aria-hidden="true" class="garland"></span>
      </h1>
    </>
  );
}
