import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('message-item')
export class MessageItem extends LitElement {
  @property({ type: String })
  role: 'system' | 'user' = 'system';

  connectedCallback(): void {
    super.connectedCallback();
    this.classList.add(this.role);
  }

  render() {
    return html`
      <div class="content">
        <slot></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
    }

    :host(.system) {
      flex-direction: row;
    }

    :host(.user) {
      flex-direction: row-reverse;
    }
    
    :host(.system) .content {
      padding: 1rem 0;
    }

    :host(.user) .content {
      padding: 1rem 2rem;
      border-radius: 2rem;
      background-color: var(--color-medium-contrast);
    }
  `;
}
