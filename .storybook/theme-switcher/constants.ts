// Unique identifiers for our addon
export const ADDON_ID = 'storybook/theme-switcher';
export const TOOL_ID = `${ADDON_ID}/tool`;

// Event names for communication between manager and preview
export const EVENTS = {
  UPDATE: `${ADDON_ID}/update`,
  CHANGE: `${ADDON_ID}/change`,
}; 