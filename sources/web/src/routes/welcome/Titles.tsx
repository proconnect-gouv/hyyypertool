import { visually_hidden } from "#src/ui/visually_hidden";

export const KineticTitle = () => (
  <div
    class="perspective-distant flex min-h-[200px] flex-wrap items-center justify-center"
    x-data={`{
        text: 'H' + Array.from( { length: Math.floor(3 + Math.random() * 7) }).fill('y').join('') + 'pertool',
        letters: [],
        show: false,
        y_first_index: 0,
        y_last_index: 0,
        init() {
            this.letters = this.text.split('');
            this.y_first_index = this.letters.findIndex(letter => letter === 'y') - 1;
            this.y_last_index = this.letters.findLastIndex(letter => letter === 'y');
            setTimeout(() => this.show = true, 100);
        },
        getColorClass(index) {
            if (index <= this.y_first_index) return 'text-[var(--text-active-blue-france)]';
            if (index >= this.y_first_index && index <= this.y_last_index) return 'text-white';
            if (index >= this.y_last_index) return 'text-[var(--text-active-red-marianne)]';
            return '';
        }
    }`}
  >
    <h1
      class="flex flex-wrap text-8xl font-black uppercase tracking-tighter"
      aria-label="Hyyypertool"
    >
      <template x-for="(letter, index) in letters">
        <span
          class="inline-block transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] motion-reduce:transform-none motion-reduce:transition-none"
          x-bind:style="'transition-delay: ' + (index * Math.random() * 35) + 'ms'"
          x-bind:class="[
            show ? 'opacity-100 translate-y-0 rotate-0 scale-100 blur-0' : 'opacity-0 translate-y-16 rotate-25 scale-50 blur-md',
            getColorClass(index)
          ].join(' ')"
          x-text="letter"
        ></span>
      </template>
    </h1>
    <span class={visually_hidden()}>Hyyypertool</span>
  </div>
);

export const TerminalTitle = () => (
  <div
    class="flex min-h-[200px] items-center justify-center rounded-lg bg-slate-950 p-8 shadow-2xl"
    x-data={`{
        fullText: 'Hyyypertool',
        text: '',
        idx: 0,
        finished: false,
        finalHTML: '<span class=\"text-[var(--text-active-blue-france)]\">Hyyy</span><span class=\"text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]\">per</span><span class=\"text-[var(--text-active-red-marianne)]\">tool</span>',
        init() {
            setTimeout(() => this.type(), 500);
        },
        type() {
            if (this.idx < this.fullText.length) {
                this.text += this.fullText.charAt(this.idx);
                this.idx++;
                setTimeout(() => this.type(), 50 + Math.random() * 100);
            } else {
                this.finished = true;
            }
        }
    }`}
  >
    <div class="inline-flex items-center font-mono text-6xl font-bold text-slate-100">
      <span class="mr-4 text-slate-500">$</span>

      {/* Typing Phase */}
      <span x-show="!finished" class="text-slate-100" x-text="text"></span>

      {/* Finished Phase (Colored) */}
      <span x-show="finished" x-html="finalHTML"></span>

      <span
        class="ml-2 inline-block h-12 w-3 bg-green-500"
        x-bind:class="finished ? 'hidden' : 'animate-pulse'"
      ></span>
    </div>
  </div>
);
