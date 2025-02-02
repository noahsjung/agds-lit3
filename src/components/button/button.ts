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

  /**
   * Lifecycle callback that is called when the element is added to the document's DOM.
   * This method:
   * 1. Calls the parent class's connectedCallback
   * 2. Logs the initial theme configuration for debugging
   * 3. Sets the data attributes to match the component properties, ensuring
   *    the DOM reflects the current state
   */
  override connectedCallback() {
    super.connectedCallback();    
    this.setAttribute('data-theme', this.theme);
    this.setAttribute('data-mode', this.mode);
    this.setAttribute('data-display', this.display);
  }

  /**
   * Lifecycle callback that is called when an observed attribute is changed.
   * This method:
   * 1. Calls the parent class's attributeChangedCallback
   * 2. Logs the attribute change for debugging
   * 3. Updates the corresponding property when a data attribute changes,
   *    maintaining two-way binding between properties and attributes
   * 
   * @param name - The name of the attribute that changed
   * @param old - The previous value of the attribute
   * @param value - The new value of the attribute
   */
  override attributeChangedCallback(name: string, old: string, value: string) {
    super.attributeChangedCallback(name, old, value);
    console.log('Attribute changed:', { name, old, value });
    
    if (name === 'data-theme') this.theme = value;
    if (name === 'data-mode') this.mode = value;
    if (name === 'data-display') this.display = value;
  }

  /**
   * Renders the button component.
   * This method:
   * 1. Logs the current theme configuration for debugging
   * 2. The actual render logic continues below this selection
   */
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