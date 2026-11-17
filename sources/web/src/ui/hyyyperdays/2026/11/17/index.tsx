//

import type { HyyyperDayProps } from "#src/ui/hyyyperdays";
import { visually_hidden } from "#src/ui/visually_hidden";

//

const ANNOUNCED_HYYYPERDAYS = ["2026-12-01", "2027-07-01"] as const;
const Y_FADE_MS = 444;

const ANNOUNCEMENT_CSS = `
.hyyyperday-announcement {
  & .y {
    animation: hyyyperday-announcement-fade ${Y_FADE_MS}ms both;
    display: inline-block;
  }

  & .per {
    animation: hyyyperday-announcement-fade 300ms ${Y_FADE_MS}ms both;
    color: #fff;
    text-shadow: 0 0 4px #000;
  }

  & .slot {
    display: inline-block;
    position: relative;
  }

  & .tool {
    animation:
      hyyyperday-announcement-zoom-in-down 1s 1s both,
      hyyyperday-announcement-hinge 2s 4.3s forwards;
    display: inline-block;
    opacity: 0;
    transform-origin: top left;
  }

  & .tool-outline {
    -webkit-text-stroke: 2px #e1000f;
    animation: hyyyperday-announcement-pop 600ms 6.3s both;
    color: transparent;
    inset: 0;
    position: absolute;
  }

  & .aside {
    animation: hyyyperday-announcement-slide 600ms 6.7s both;
    color: #e1000f;
    font-size: 1rem;
    font-weight: normal;
    left: calc(100% + 0.75rem);
    position: absolute;
    top: 50%;
    translate: 0 -50%;
    white-space: nowrap;
  }

  & .typewriter {
    animation:
      hyyyperday-announcement-typing 2.8s steps(28) 1s both,
      hyyyperday-announcement-caret 700ms step-end 1s 6;
    border-right: 2px solid transparent;
    font-family: ui-monospace, monospace;
    overflow: hidden;
    white-space: nowrap;
    width: 28ch;
  }
}

@keyframes hyyyperday-announcement-fade {
  from { opacity: 0; }
}

@keyframes hyyyperday-announcement-zoom-in-down {
  from { opacity: 0; transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0); }
  60% { opacity: 1; transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0); }
  to { opacity: 1; transform: none; }
}

@keyframes hyyyperday-announcement-hinge {
  0% { animation-timing-function: ease-in-out; opacity: 1; transform: none; }
  20%, 60% { animation-timing-function: ease-in-out; opacity: 1; transform: rotate3d(0, 0, 1, 80deg); }
  40%, 80% { animation-timing-function: ease-in-out; opacity: 1; transform: rotate3d(0, 0, 1, 60deg); }
  to { opacity: 0; transform: translate3d(0, 700px, 0); }
}

@keyframes hyyyperday-announcement-pop {
  from { opacity: 0; scale: 0.3; }
  70% { scale: 1.1; }
}

@keyframes hyyyperday-announcement-slide {
  from { opacity: 0; translate: -1rem -50%; }
}

@keyframes hyyyperday-announcement-typing {
  from { width: 0; }
}

@keyframes hyyyperday-announcement-caret {
  50% { border-color: currentColor; }
}

@media (prefers-reduced-motion: reduce) {
  .hyyyperday-announcement,
  .hyyyperday-announcement * {
    animation: none !important;
  }
}
`;

//

export default function Announcement({ nonce }: HyyyperDayProps) {
  const y_count = Math.floor(3 + Math.random() * 5);
  const announced =
    ANNOUNCED_HYYYPERDAYS[
      Math.floor(Math.random() * ANNOUNCED_HYYYPERDAYS.length)
    ];

  return (
    <div class="hyyyperday-announcement flex flex-col items-center gap-4">
      <style
        dangerouslySetInnerHTML={{ __html: ANNOUNCEMENT_CSS }}
        nonce={nonce}
      />
      <h1 class="text-5xl font-bold drop-shadow-lg">
        <span class={visually_hidden()}>Bonjour Hyyypertool !</span>
        <span aria-hidden="true">
          <span class="text-blue-france">H</span>
          {Array.from({ length: y_count }, (_, index) => (
            <span
              class="y text-blue-france"
              style={`animation-delay: ${(index * Y_FADE_MS) / y_count}ms`}
            >
              y
            </span>
          ))}
          <span class="per">per</span>
          <span class="slot">
            <span class="tool text-red-marianne">tool</span>
            <span class="tool-outline">tool</span>
            <span class="aside">another HyyyperDay &lt;3</span>
          </span>
        </span>
      </h1>
      <p class="typewriter">
        will now display{" "}
        <a
          class="text-blue-france underline"
          href={`/?hyyyperdate=${announced}`}
        >
          HyyyperDays
        </a>
      </p>
    </div>
  );
}
