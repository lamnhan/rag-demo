import DOMPurify from 'dompurify';
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { parse } from 'marked';

import type { Product } from '../../shared/types';

@customElement('result-message')
export class MessageItem extends LitElement {
  @property({ type: String }) message = '';
  @property({ type: Array }) products: Product[] = [];

  @state() private parsedMessage = '';

  async willUpdate(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has('message')) {
      const parsedMessage = await parse(this.message);
      this.parsedMessage = DOMPurify.sanitize(parsedMessage);
    }
  }

  render() {
    return !this.parsedMessage
      ? null
      : html`
        <div class="message">
          ${unsafeHTML(this.parsedMessage)}
        </div>
        ${
          this.products.length <= 0
            ? null
            : html`
          <div class="products-row">
            ${this.products.map(
              (product) => html`
              <a href=${product.url} class="product-card">
                <img src=${product.thumbnail} alt=${product.title} />
                <div class="product-title">${product.title}</div>
              </a>
            `,
            )}
          </div>
        `
        }
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }

    .message {
      margin-bottom: 1rem;
    }

    .products-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(200px, 1fr));
      gap: 1rem;
      padding: 0.5rem 0;
    }

    .product-card {
      border: 1px solid var(--color-medium-contrast);
      border-radius: 8px;
      overflow: hidden;
      color: inherit;
      text-decoration: none;
      display: block;
      transition: border-color 0.3s ease;
    }

    .product-card:hover {
      border-color: var(--color-medium);
    }

    .product-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .product-title {
      padding: 0.5rem;
      font-size: 0.9rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      .products-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .products-row {
        grid-template-columns: 1fr;
      }
    }
  `;
}
