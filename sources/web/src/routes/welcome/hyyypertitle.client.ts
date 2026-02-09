//
//

import { visually_hidden } from "#src/ui/visually_hidden";

//

export class Hyyyper_title extends HTMLElement {
  connectedCallback() {
    const yCount = Math.floor(3 + Math.random() * 5);
    const duration = 444;

    this.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in {
          animation: fadeIn ${duration}ms both;
        }
        #per {
          opacity: 0;
          text-shadow: 0 0 4px #000;
        }
        #per.show {
          opacity: 1;
        }
      </style>

      <div class="inline-flex">
        <span class="${visually_hidden()}">Bonjour Hyyypertool !</span>
        <span class="text-text-active-blue-france">H</span>
        <span class="text-text-active-blue-france">
          ${Array.from(
            { length: yCount },
            (_, i) =>
              `<span class="fade-in" style="animation-delay: ${(i * duration) / yCount}ms">y</span>`,
          ).join("")}
        </span>
        <span id="per" class="animated flash fast inline-block text-white">per</span>
        <span class="animated slower delay-1s zoomInDown inline-block text-text-active-red-marianne">tool</span>
      </div>
    `;

    // Show "per" after all y's have animated
    setTimeout(() => {
      this.querySelector("#per")?.classList.add("show");
    }, duration);
  }
}

customElements.define("hyyyper-title", Hyyyper_title);
