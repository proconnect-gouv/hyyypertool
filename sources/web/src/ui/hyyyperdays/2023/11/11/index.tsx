//

import type { HyyyperDayProps } from "#src/ui/hyyyperdays";

//

export default function HyyyperTitle({ assets_path, nonce }: HyyyperDayProps) {
  return (
    <h1 class="text-5xl font-bold drop-shadow-lg">
      <hyyyper-title>Bonjour Hyyypertool !</hyyyper-title>
      <script
        nonce={nonce}
        src={`${assets_path}/ui/hyyyperdays/2023/11/11/hyyypertitle.client.js`}
        type="module"
      ></script>
    </h1>
  );
}
