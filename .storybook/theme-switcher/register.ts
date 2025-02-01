import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, TOOL_ID, EVENTS } from './constants';
import { ThemeSwitcher } from './ThemeSwitcher';

// Register the addon
addons.register(ADDON_ID, (api) => {
  // Get the channel
  const channel = api.getChannel();
  if (!channel) return;

  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Theme Switcher',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: ThemeSwitcher,
  });

  // Listen for theme changes
  api.on(EVENTS.CHANGE, (theme) => {
    channel.emit(EVENTS.UPDATE, theme);
  });

  // Initialize with current theme
  const globals = api.getGlobals();
  if (globals.themeConfig) {
    channel.emit(EVENTS.UPDATE, globals.themeConfig);
  }

  // Listen for global changes
  api.on('globals', ({ globals }) => {
    if (globals.themeConfig) {
      channel.emit(EVENTS.UPDATE, globals.themeConfig);
    }
  });
}); 