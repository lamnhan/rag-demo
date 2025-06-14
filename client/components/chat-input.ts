import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

@customElement('chat-input')
export class ChatInput extends LitElement {
  #textareaRef = createRef<HTMLTextAreaElement>();

  #onClickSend() {
    this.#emitMessage();
  }

  #emitMessage() {
    if (this.#textareaRef.value?.value) {
      const value = this.#textareaRef.value.value;
      this.#textareaRef.value.value = '';
      this.dispatchEvent(new CustomEvent('message', { detail: value }));
    }
  }

  render() {
    return html`
      <textarea class="textarea" ${ref(this.#textareaRef)} placeholder="How may I help you?"></textarea>
      <button class="send-button" @click=${this.#onClickSend}>
        <img src="data:image/svg+xml,<%3Fxml version='1.0' encoding='utf-8'%3F><svg width='800px' height='800px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 17L12 8' stroke='%23f4f5f8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M16 11L12 7L8 11' stroke='%23f4f5f8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>" alt="Send" />
      </button>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      gap: 1rem;
      border: 1px solid var(--color-medium);
      border-radius: 2rem;
      padding: 1rem;
    }
    
    .textarea {
      flex: 1;
      border: none;
      border-radius: 2rem;
      padding: 0.5rem 0.5rem 1rem;
      height: 3rem;
      font-size: 1rem;
      outline: none;
      resize: none;
    }

    .send-button {
      cursor: pointer;
      background-color: var(--color-primary);
      border: none;
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;

      img {
        width: 100%;
        height: 100%;
      }

      &:active {
        opacity: 0.8;
      }
    }
  `;
}
