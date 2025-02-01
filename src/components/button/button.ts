import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './button.css?inline';

@customElement('agds-button')
export class Button extends LitElement {
  static override styles = css`${unsafeCSS(styles)}`;

  @property({ type: String, reflect: true, attribute: 'data-theme' })
  theme: string = 'ugds';

  @property({ type: String, reflect: true, attribute: 'data-mode' })
  mode: string = 'light';

  @property({ type: String, reflect: true, attribute: 'data-display' })
  display: string = 'desktop';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  override connectedCallback() {
    super.connectedCallback();
    console.log('Button connected:', {
      theme: this.theme,
      mode: this.mode,
      display: this.display
    });
    
    this.setAttribute('data-theme', this.theme);
    this.setAttribute('data-mode', this.mode);
    this.setAttribute('data-display', this.display);

    // Debug CSS variables
    setTimeout(() => {
      const computedStyle = getComputedStyle(this);
      console.log('CSS Variables:', {
        '--button-bg-color': computedStyle.getPropertyValue('--button-bg-color'),
        '--primary-color': computedStyle.getPropertyValue('--primary-color'),
        '--color-blue-500': computedStyle.getPropertyValue('--color-blue-500')
      });
    }, 0);
  }

  override attributeChangedCallback(name: string, old: string, value: string) {
    super.attributeChangedCallback(name, old, value);
    console.log('Attribute changed:', { name, old, value });
    
    if (name === 'data-theme') this.theme = value;
    if (name === 'data-mode') this.mode = value;
    if (name === 'data-display') this.display = value;
  }

  override render() {
    console.log('Rendering button with:', {
      theme: this.theme,
      mode: this.mode,
      display: this.display
    });

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