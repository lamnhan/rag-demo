import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import helloImage from './assets/hello.webp';

import type { Product } from '../shared/types';
import { trpc } from './trpc';

import './components/chat-input.js';
import './components/simulated-text.js';
import './components/simulated-text-with-extra.js';
import './components/message-item.js';
import './components/thinking-message.js';
import './components/result-message.js';

@customElement('app-root')
export class AppRoot extends LitElement {
  @state() private aiMessage = '';
  @state() private products: Product[] = [];

  async #onMessage({ detail: userMessage }: CustomEvent<string>) {
    const result = await trpc.product.getResponseAndProducts.query({
      userMessage,
    });
    console.log(userMessage, result);
    this.aiMessage = result.response;
    this.products = result.products;
  }

  render() {
    return html`
      <div class="body">

        <div class="messages">

          <message-item role="system">
            <simulated-text-with-extra text=${`Hi, my name is FOO BAR, your shopping assistant!\nI'm here to help you find the perfect product for your needs.`}>
              <div class="hello-image">
                <img src=${helloImage} />
              </div>
            </simulated-text-with-extra>
          </message-item>

          <message-item role="user">
            <p>Hello, how are you?</p>
          </message-item>

          <message-item role="system">
            <thinking-message></thinking-message>
          </message-item>

          <message-item role="system">
            <result-message message=${this.aiMessage} .products=${this.products}></result-message>
          </message-item>

        </div>

      </div>

      <div class="foot">
        <chat-input @message=${this.#onMessage}></chat-input>
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      margin: auto;
      padding: 1rem;
      max-width: 1000px;
    }

    .body {
      padding: 0 0 8rem;

      .messages {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .hello-image img {
        width: 180px;
        height: 180px;
        margin-top: 1rem;
      }
    }

    .foot {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem 1rem;
      max-width: 1000px;
      margin: auto;
      background-color: var(--color-body);
    }
  `;
}
