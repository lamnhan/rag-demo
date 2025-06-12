import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('simulated-text-with-extra')
export class SimulatedTextWithExtra extends LitElement {
  @property({ type: String }) text = '';
  @property({ type: Boolean }) instant = false;

  @state() private isTypingComplete = false;

  #handleTypingComplete() {
    this.isTypingComplete = true;
    this.dispatchEvent(new CustomEvent('complete'));
  }

  render() {
    return html`
      <simulated-text
        .text=${this.text}
        .instant=${this.instant}
        @complete=${this.#handleTypingComplete}
      ></simulated-text>
      ${!this.isTypingComplete ? null : html`<div class="extra-content"><slot></slot></div>`}
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }

    .extra-content {
      opacity: 0;
      animation: fadeIn 0.5s ease-in forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
}
