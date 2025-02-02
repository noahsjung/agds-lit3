import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './secondary-button.css';

/**
 * Secondary button component
 * @customElement agds-secondary-button
 */
@customElement('agds-secondary-button')
export class SecondaryButton extends LitElement {
  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  render() {
    return html`
      <button
        class="secondary-button"
        ?disabled=${this.disabled}
        data-theme=${this.getAttribute('data-theme') || 'ugds'}
        data-mode=${this.getAttribute('data-mode') || 'light'}
        data-display=${this.getAttribute('data-display') || 'desktop'}
      >
        <slot></slot>
      </button>
    `;
  }

  // Use external styles instead of shadowDOM for better theme customization
  protected createRenderRoot() {
    return this;
  }
} 