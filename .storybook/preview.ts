import type { Preview } from '@storybook/web-components';
import { withTheme } from './theme-switcher/withTheme';
import { DISPLAY_VIEWPORT_SIZES } from '../src/styles/viewport-config';
import type { DisplayType } from '../src/styles/theme-config';
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
  decorators: [withTheme],
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
  },
  globalTypes: {
    themeConfig: {
      name: 'Theme Config',
      description: 'Global theme configuration',
      defaultValue: {
        theme: 'ugds',
        mode: 'light',
        display: 'desktop'
      },
    },
  },
};

export default preview;
