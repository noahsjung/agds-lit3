import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import buttonStyles from './button.css?inline';

@customElement('ds-button')
export class Button extends LitElement {
  static override styles = css`${unsafeCSS(buttonStyles)}`;

  @property({ type: Boolean }) disabled = false;
  @property({ type: String, reflect: true }) display = '';
  @property({ type: String, reflect: true }) theme = '';
  @property({ type: String, reflect: true }) mode = '';

  override connectedCallback() {
    super.connectedCallback();
    // Get theme attributes from the closest theme container
    const themeContainer = this.closest('.theme-container');
    if (themeContainer) {
      this.display = themeContainer.getAttribute('data-display') || '';
      this.theme = themeContainer.getAttribute('data-theme') || '';
      this.mode = themeContainer.getAttribute('data-mode') || '';
    }

    // Set up mutation observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const container = mutation.target as Element;
          this.display = container.getAttribute('data-display') || '';
          this.theme = container.getAttribute('data-theme') || '';
          this.mode = container.getAttribute('data-mode') || '';
        }
      });
    });

    if (themeContainer) {
      observer.observe(themeContainer, {
        attributes: true,
        attributeFilter: ['data-theme', 'data-mode', 'data-display']
      });
    }
  }

  override render() {
    return html`
      <button 
        ?disabled=${this.disabled}
        data-theme=${this.theme}
        data-mode=${this.mode}
        data-display=${this.display}
      >
        <slot></slot>
      </button>
    `;
  }
} 