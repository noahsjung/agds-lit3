// Theme Types
export type ThemeType = 'ugds' | 'marlo';
export type ThemeMode = 'light' | 'dark';
export type DisplayType = 
  | 'compass'
  | 'desktop'
  | 'flacs-800'
  | 'flacs-1920'
  | 'florence-800'
  | 'florence-1920'
  | '4k'
  | 'mobile'
  | 'tablet'
  | 'udx'
  | 'urs-od'
  | 'urs-portal'
  | 'urs-surgeon';

// Theme Configuration Interface
export interface ThemeConfig {
  theme: ThemeType;
  mode: ThemeMode;
  display: DisplayType;
}

// Available Options
export const THEME_OPTIONS: ThemeType[] = ['ugds', 'marlo'];
export const MODE_OPTIONS: ThemeMode[] = ['light', 'dark'];
export const DISPLAY_OPTIONS: DisplayType[] = [
  'compass',
  'desktop',
  'flacs-800',
  'flacs-1920',
  'florence-800',
  'florence-1920',
  '4k',
  'mobile',
  'tablet',
  'udx',
  'urs-od',
  'urs-portal',
  'urs-surgeon'
]; 