import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const getRandomDelay = () => Math.random() * 150 + 50; // Random delay between 50-200ms
const getRandomChunkSize = () => {
  const rand = Math.random();
  if (rand < 0.3) return Math.floor(Math.random() * 3) + 2; // 30% chance: 2-4 chars
  if (rand < 0.7) return Math.floor(Math.random() * 4) + 4; // 40% chance: 4-7 chars
  return Math.floor(Math.random() * 5) + 8; // 30% chance: 8-12 chars
};

@customElement('simulated-text')
export class SimulatedText extends LitElement {
  @property({ type: String }) text = '';
  @property({ type: Boolean }) instant = false;

  @state() private displayedText = '';
  @state() private currentIndex = 0;

  #timeoutId?: ReturnType<typeof setTimeout>;

  willUpdate(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has('text')) {
      this.displayedText = '';
      this.currentIndex = 0;
      this.#simulateTyping();
    }
  }

  #complete() {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
    }
    this.dispatchEvent(new CustomEvent('complete'));
  }

  #simulateTyping() {
    if (this.instant) {
      this.displayedText = this.text;
      return this.#complete();
    }

    // Normalize line breaks to \n
    const normalizedText = this.text.replace(/\r\n|\r/g, '\n');
    if (this.currentIndex >= normalizedText.length) {
      return this.#complete();
    }

    // Get next chunk of characters
    const chunkSize = getRandomChunkSize();
    const nextChunk = normalizedText.slice(
      this.currentIndex,
      this.currentIndex + chunkSize,
    );
    const isWordBoundary = nextChunk.includes(' ') || nextChunk.includes('\n');

    // Simulate typing
    this.#timeoutId = setTimeout(
      () => {
        this.displayedText += nextChunk;
        this.currentIndex += chunkSize;
        this.#simulateTyping();
      },
      isWordBoundary ? getRandomDelay() : 40,
    );
  }

  render() {
    return html`${this.displayedText}`;
  }

  static styles = css`
    :host {
      display: block;
      white-space: pre-wrap;
    }
  `;
}
