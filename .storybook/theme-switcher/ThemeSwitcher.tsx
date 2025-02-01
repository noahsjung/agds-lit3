import React, { useCallback } from 'react';
import { useGlobals, useStorybookApi } from '@storybook/manager-api';
import { IconButton, Icons, TooltipLinkList, WithTooltip } from '@storybook/components';
import { EVENTS } from './constants';
import {
  ThemeType,
  ThemeMode,
  DisplayType,
  THEME_OPTIONS,
  MODE_OPTIONS,
  DISPLAY_OPTIONS,
} from '../../src/styles/theme-config';

export interface ThemeState {
  theme: ThemeType;
  mode: ThemeMode;
  display: DisplayType;
}

const DEFAULT_STATE: ThemeState = {
  theme: 'ugds',
  mode: 'light',
  display: 'desktop'
};

export const ThemeSwitcher: React.FC = () => {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  // Ensure we have a valid theme config
  const currentState = globals.themeConfig || DEFAULT_STATE;

  const updateThemeConfig = useCallback((updates: Partial<ThemeState>) => {
    const newConfig = {
      ...currentState,
      ...updates,
    };

    // Update globals
    updateGlobals({
      themeConfig: newConfig,
    });

    // Force a preview refresh
    api.setQueryParams({
      globals: JSON.stringify({
        ...globals,
        themeConfig: newConfig,
      }),
    });

    // Emit theme change event
    api.emit(EVENTS.CHANGE, newConfig);
  }, [api, currentState, globals, updateGlobals]);

  const createClickHandler = (type: keyof ThemeState, value: string, onHide: () => void) => () => {
    updateThemeConfig({ [type]: value });
    onHide();
  };

  const themeItems = THEME_OPTIONS.map((theme) => ({
    id: theme,
    title: theme.toUpperCase(),
    active: currentState.theme === theme,
    value: theme,
  }));

  const modeItems = MODE_OPTIONS.map((mode) => ({
    id: mode,
    title: mode.charAt(0).toUpperCase() + mode.slice(1),
    active: currentState.mode === mode,
    value: mode,
  }));

  const displayItems = DISPLAY_OPTIONS.map((display) => ({
    id: display,
    title: display,
    active: currentState.display === display,
    value: display,
  }));

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {/* Theme Selector */}
      <WithTooltip
        placement="bottom"
        trigger="click"
        tooltip={({ onHide }) => (
          <TooltipLinkList
            links={themeItems.map(item => ({
              ...item,
              onClick: createClickHandler('theme', item.value, onHide),
            }))}
          />
        )}
      >
        <IconButton
          key="theme"
          title="Theme"
          active={currentState.theme !== DEFAULT_STATE.theme}
        >
          <Icons icon="paintbrush" />
          <span style={{ marginLeft: 5 }}>{currentState.theme.toUpperCase()}</span>
        </IconButton>
      </WithTooltip>

      {/* Mode Selector */}
      <WithTooltip
        placement="bottom"
        trigger="click"
        tooltip={({ onHide }) => (
          <TooltipLinkList
            links={modeItems.map(item => ({
              ...item,
              onClick: createClickHandler('mode', item.value, onHide),
            }))}
          />
        )}
      >
        <IconButton
          key="mode"
          title="Mode"
          active={currentState.mode !== DEFAULT_STATE.mode}
        >
          {currentState.mode === 'dark' ? <Icons icon="moon" /> : <Icons icon="sun" />}
          <span style={{ marginLeft: 5 }}>{currentState.mode}</span>
        </IconButton>
      </WithTooltip>

      {/* Display Selector */}
      <WithTooltip
        placement="bottom"
        trigger="click"
        tooltip={({ onHide }) => (
          <TooltipLinkList
            links={displayItems.map(item => ({
              ...item,
              onClick: createClickHandler('display', item.value, onHide),
            }))}
          />
        )}
      >
        <IconButton
          key="display"
          title="Display"
          active={currentState.display !== DEFAULT_STATE.display}
        >
          <Icons icon="grow" />
          <span style={{ marginLeft: 5 }}>{currentState.display}</span>
        </IconButton>
      </WithTooltip>
    </div>
  );
}; 