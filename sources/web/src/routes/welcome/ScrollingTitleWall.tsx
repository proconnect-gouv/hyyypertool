//

import { visually_hidden } from "#src/ui/visually_hidden";

export const ScrollingTitleWall = () => {
  const rows = Array.from({ length: 20 }, (_, rowIndex) => {
    return (
      <div
        key={`row-${rowIndex}`}
        class="animate-diagonal-scroll whitespace-nowrap"
        style={{
          top: `${rowIndex * 80}px`,
          animationDelay: `${-rowIndex * 0.1}s`,
        }}
      >
        {Array.from({ length: 15 }, (_, i) => {
          return <HyyyperTitle rowIndex={rowIndex} i={i} />;
        })}
      </div>
    );
  });

  return (
    <div class="relative min-h-[calc(100vh-41.5px)] w-full overflow-hidden bg-slate-950">
      {/* Animated Background Grid */}
      <div class="bg-grid-slate-800/20 bg-size-[40px_40px] absolute inset-0"></div>

      {/* Diagonal Scrolling Title Wall */}
      <div class="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
        {rows}
      </div>

      {/* Center Content */}
      <div class="relative flex h-full w-full items-center justify-center">
        <div class="z-10 px-6 text-center">
          <span class={visually_hidden()}>
            Hyyypertool - Backoffice moderation tool for MonComptePro
          </span>
        </div>
      </div>

      {/* Overlay Gradient - Strong center focus */}
      <div class="bg-linear-to-b pointer-events-none absolute inset-0 from-slate-950/70 via-slate-950/20 to-slate-950/70"></div>

      <style jsx>{`
        @keyframes diagonal-scroll {
          0% {
            transform: translateX(100%) translateY(0);
          }
          100% {
            transform: translateX(-100%) translateY(-100%);
          }
        }

        .animate-diagonal-scroll {
          animation: diagonal-scroll 120s linear infinite;
          position: absolute;
          right: 100%;
        }
      `}</style>
    </div>
  );
};

function HyyyperTitle(props: { rowIndex: number; i: number }) {
  const { rowIndex, i } = props;
  const text_color = [
    "text-(--text-active-blue-france)",
    "text-white",
    "text-(--text-active-red-marianne)",
  ][(rowIndex + i) % 3];

  return (
    <span
      key={`${rowIndex}-${i}`}
      class={`inline-block px-4 text-5xl font-black ${text_color}`}
    >
      H
      {Array.from({ length: Math.floor(3 + Math.random() * 7) })
        .fill("y")
        .join("")}
      pertool
    </span>
  );
}
