import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

const THINKING_MESSAGES = [
  'Let me explore what we have ...',
  'Searching through our collection ...',
  'Let me find the perfect matches ...',
  "I'll discover what's available ...",
  'Let me check our inventory ...',
  "I'm looking through our selection ...",
  'Let me browse what we have ...',
  "I'll find some great options ...",
  'Let me see what matches ...',
  "I'm exploring our catalog ...",
];

const getRandomThinkingMessage = () => {
  const randomIndex = Math.floor(Math.random() * THINKING_MESSAGES.length);
  return THINKING_MESSAGES[randomIndex];
};

@customElement('thinking-message')
export class ThinkingMessage extends LitElement {
  render() {
    return html`
      <simulated-text-with-extra
        .text=${getRandomThinkingMessage()}
      >
        <div class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </simulated-text-with-extra>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .loader {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 64px;
      height: 48px;
      margin-top: 12px;
      border-radius: 1000px;
      background-color: var(--color-medium-contrast);
    }

    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: var(--color-primary);
      animation: pulse 1.4s ease-in-out infinite;
    }

    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.2;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
}
