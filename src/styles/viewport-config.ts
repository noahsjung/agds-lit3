import type { DisplayType } from './theme-config';

// Re-export the type
export type { DisplayType };

export const DISPLAY_VIEWPORT_SIZES: Record<DisplayType, { width: number; height: number }> = {
  'compass': { width: 1024, height: 768 },
  'desktop': { width: 1920, height: 1080 },
  'flacs-800': { width: 800, height: 600 },
  'flacs-1920': { width: 1920, height: 1080 },
  'florence-800': { width: 800, height: 600 },
  'florence-1920': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
  'mobile': { width: 375, height: 667 },
  'tablet': { width: 768, height: 1024 },
  'udx': { width: 1920, height: 1080 },
  'urs-od': { width: 1920, height: 1080 },
  'urs-portal': { width: 1920, height: 1080 },
  'urs-surgeon': { width: 1920, height: 1080 }
}; 