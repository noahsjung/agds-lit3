import type { Preview } from '@storybook/web-components';
import { html } from 'lit';
import { DISPLAY_VIEWPORT_SIZES } from '../src/styles/viewport-config';
import type { DisplayType } from '../src/styles/theme-config';

// Import CSS files in order of specificity
import '../src/styles/primitives-variables/root.css';
import '../src/styles/semantics-variables/themes/ugds-light.css';
import '../src/styles/semantics-variables/themes/ugds-dark.css';
import '../src/styles/semantics-variables/themes/marlo-light.css';
import '../src/styles/semantics-variables/themes/marlo-dark.css';
import '../src/styles/semantics-variables/display.css';
import '../src/styles/component-variables/button-variables.css';

// Create viewports from our display configurations
const viewports = Object.entries(DISPLAY_VIEWPORT_SIZES).reduce((acc, [name, dimensions]) => {
  acc[name as DisplayType] = {
    name,
    styles: {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
    },
  };
  return acc;
}, {} as Record<DisplayType, { name: string; styles: { width: string; height: string } }>);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports,
      defaultViewport: 'desktop',
    },
    backgrounds: {
      disable: true,
    },
  },
  decorators: [
    (story, context) => {
      // Get theme config from globals
      const { theme = 'ugds', mode = 'light', display = 'desktop' } = context.globals.themeConfig || {};
      
      // Set background color based on mode
      const backgroundColor = mode === 'dark' ? 'var(--color-gray-900)' : 'var(--color-white)';
      const textColor = mode === 'dark' ? 'var(--color-white)' : 'var(--color-black)';

      console.log('Storybook decorator:', { theme, mode, display });
      
      return html`
        <div 
          class="theme-container"
          style="
            padding: 2rem;
            min-height: 200px;
            background-color: ${backgroundColor};
            color: ${textColor};
            transition: background-color 0.3s, color 0.3s;
          "
          data-theme=${theme}
          data-mode=${mode}
          data-display=${display}
        >
          ${story({
            ...context,
            args: {
              ...context.args,
              'data-theme': theme,
              'data-mode': mode,
              'data-display': display,
            },
          })}
        </div>
      `;
    },
  ],
  globalTypes: {
    themeConfig: {
      name: 'Theme Config',
      description: 'Global theme configuration',
      defaultValue: {
        theme: 'ugds',
        mode: 'light',
        display: 'desktop'
      },
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: { theme: 'ugds', mode: 'light', display: 'desktop' }, title: 'UGDS Light' },
          { value: { theme: 'ugds', mode: 'dark', display: 'desktop' }, title: 'UGDS Dark' },
          { value: { theme: 'marlo', mode: 'light', display: 'desktop' }, title: 'Marlo Light' },
          { value: { theme: 'marlo', mode: 'dark', display: 'desktop' }, title: 'Marlo Dark' },
        ],
      },
    },
  },
};

export default preview;
