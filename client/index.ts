import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { state } from 'lit/decorators/state.js';

import type { Product } from '../shared/types';
import { trpc } from './trpc';

@customElement('app-root')
export class AppRoot extends LitElement {
  @state() aiResponse = '';
  @state() products: Product[] = [];

  async sendMessage(userMessage: string) {
    const result = await trpc.product.getResponseAndProducts.query({
      userMessage,
    });
    console.log(result);
    this.aiResponse = result.response;
    this.products = result.products;
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      this.sendMessage(target.value);
      target.value = '';
    }
  }

  render() {
    return html`
      <textarea @keydown=${this.onEnter}></textarea>
      <hr />
      <div style="white-space: pre-wrap;">${this.aiResponse}</div>
      <hr />
      <ul class="products">
        ${this.products.map(
          (product) => html`
          <li>
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h3>${product.title}</h3>
          </li>
        `,
        )}
      </ul>
    `;
  }

  static styles = css`
    .products {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .products li {
      display: flex;
      gap: 1rem;
    }

    .products li img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
