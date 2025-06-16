import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import helloImage from './assets/hello.webp';

import type { Message } from '../shared/types';
import { trpc } from './trpc';

import './components/chat-input.js';
import './components/simulated-text.js';
import './components/simulated-text-with-extra.js';
import './components/message-item.js';
import './components/thinking-message.js';
import './components/result-message.js';
import './components/error-message.js';

@customElement('app-root')
export class AppRoot extends LitElement {
  @state() private messages: Message[] = [
    {
      id: 'welcome',
      content: html`
        <message-item role="system">
          <simulated-text-with-extra text=${`Hi there! I'm SHOPPILIUS MAXIMUS - your shopping assistant.\nI'm here to help you find the perfect product for your needs.\nPlease tell me what you're looking for?`}>
            <img class="hello-image" src=${helloImage} alt="SHOPPILIUS MAXIMUS" />
          </simulated-text-with-extra>
        </message-item>
      `,
    },
  ];

  #scrollTo(mode: 'latestMessage' | 'bodyBottom', delayMs = 0) {
    setTimeout(() => {
      if (mode === 'latestMessage') {
        const latestMessageElem = this.renderRoot.querySelector(
          'message-item:last-child',
        );
        if (latestMessageElem) {
          latestMessageElem.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (mode === 'bodyBottom') {
        scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, delayMs);
  }

  #showUserMessage(userMessage: string) {
    this.messages = [
      ...this.messages,
      {
        id: `user-${Date.now()}`,
        content: html`<message-item role="user">${userMessage}</message-item>`,
      },
    ];
    this.#scrollTo('bodyBottom', 100);
    return this.messages;
  }

  #showThinkingMessage() {
    const thinkingMessageId = `ai-thinking-${Date.now()}`;
    this.messages = [
      ...this.messages,
      {
        id: thinkingMessageId,
        content: html`
          <message-item role="system">
            <thinking-message></thinking-message>
          </message-item>
        `,
      },
    ];
    this.#scrollTo('bodyBottom', 500);
    return { thinkingMessageId, messages: this.messages };
  }

  async #requestAndShowResultMessage(
    userMessage: string,
    thinkingMessageId: string,
  ) {
    const newMessages = [...this.messages];
    const latestThinkingMessageIndex = newMessages.findIndex(
      (message) => message.id === thinkingMessageId,
    );
    if (latestThinkingMessageIndex !== -1) {
      newMessages.splice(latestThinkingMessageIndex, 1);
    }

    try {
      // wait for the AI to think
      const result = await trpc.product.getResponseAndProducts.query({
        userMessage,
      });
      // replace the thinking message with the result message
      this.messages = [
        ...newMessages,
        {
          id: `ai-result-${Date.now()}`,
          content: html`
            <message-item role="system" class="result-message">
              <result-message message=${result.response} .products=${result.products}></result-message>
            </message-item>
          `,
        },
      ];
      this.#scrollTo('latestMessage', 300);
    } catch (error) {
      // replace the thinking message with the error message
      this.messages = [
        ...newMessages,
        {
          id: `ai-error-${Date.now()}`,
          content: html`
            <message-item role="system">
              <error-message></error-message>
            </message-item>
          `,
        },
      ];
      this.#scrollTo('bodyBottom', 300);
    }
    return this.messages;
  }

  async #submitMessage({ detail: userMessage }: CustomEvent<string>) {
    // show the user's message
    this.#showUserMessage(userMessage);
    // begin the works of the AI
    const thinkingDelayRandom = Math.random();
    setTimeout(
      async () => {
        // store the AI's thinking message
        const { thinkingMessageId } = this.#showThinkingMessage();
        // request and show the result message
        await this.#requestAndShowResultMessage(userMessage, thinkingMessageId);
      },
      thinkingDelayRandom > 0.75
        ? 250
        : thinkingDelayRandom > 0.25
          ? 750
          : 1500,
    );
  }

  render() {
    return html`
      <div class="body">
        <div class="messages">
          ${repeat(
            this.messages,
            (item) => item.id,
            (item) => item.content,
          )}
        </div>
      </div>
      <div class="foot">
        <chat-input @message=${this.#submitMessage}></chat-input>
      </div>
    `;
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
    }

    .body {
      margin: auto;
      max-width: 800px;
      padding: 1rem 1rem 15rem;

      .messages {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        message-item {
          animation: messageAppear 0.3s ease-out forwards;

          &.result-message {
            padding-top: 1rem;
            border-top: 1px solid var(--color-medium-contrast);
          }
        }
      }

      .hello-image {
        width: 180px;
        margin-top: 1rem;
        border-radius: 2rem;
      }
    }

    .foot {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem 1rem;
      background-color: var(--color-body);

      chat-input {
        max-width: 800px;
        margin: auto;
      }
    }

    @keyframes messageAppear {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
}
