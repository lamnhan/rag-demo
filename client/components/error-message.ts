import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

const ERROR_MESSAGES = [
  'Oops! Something went wrong... Try again?',
  'Houston, we have a problem! Want to give it another shot?',
  "Well, that didn't go as planned... Shall we try again?",
  'Looks like we hit a snag! Care to try one more time?',
  "That's not supposed to happen... Maybe try again?",
  'Our robots are taking a coffee break! Try again in a moment?',
  "Something's not quite right... Want to try again?",
  "We're having a moment here... Shall we try that again?",
  "That's a bit awkward... Care to try one more time?",
  'Our system is feeling a bit shy today... Try again?',
];

const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * ERROR_MESSAGES.length);
  return ERROR_MESSAGES[randomIndex];
};

@customElement('error-message')
export class ErrorMessage extends LitElement {
  render() {
    return html`
      <simulated-text-with-extra
        .text=${`⚠️ ${getRandomMessage()}`}
      >
      </simulated-text-with-extra>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
  `;
}
