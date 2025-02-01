import { html } from 'lit';
import { Decorator } from '@storybook/web-components';
import { ThemeState } from './ThemeSwitcher';
import { DISPLAY_VIEWPORT_SIZES } from '../../src/styles/viewport-config';
import '../../src/styles/theme-variables.css';

const DEFAULT_STATE: ThemeState = {
  theme: 'ugds',
  mode: 'light',
  display: 'desktop'
};

export const withTheme: Decorator = (story, context) => {
  const { globals } = context;
  const themeConfig = (globals.themeConfig as ThemeState) || DEFAULT_STATE;
  
  // Apply viewport size based on display type
  const viewport = DISPLAY_VIEWPORT_SIZES[themeConfig.display];
  if (viewport) {
    context.parameters = {
      ...context.parameters,
      viewport: {
        ...context.parameters?.viewport,
        defaultViewport: themeConfig.display,
      },
    };
  }

  return html`
    <div 
      class="theme-container"
      data-theme=${themeConfig.theme}
      data-mode=${themeConfig.mode}
      data-display=${themeConfig.display}
      style="
        min-height: 200px;
        padding: var(--container-padding, 1rem);
        max-width: var(--container-max-width, 100%);
        background: var(--background-color);
        color: var(--text-color);
        font-family: var(--font-family);
        font-size: var(--font-size-md);
        transition: all 0.2s ease-in-out;
      "
    >
      ${story()}
    </div>
  `;
}; 