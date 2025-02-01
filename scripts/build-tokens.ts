#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the absolute path to the tokens directory
const TOKENS_DIR = join(__dirname, '../tokens');
const OUTPUT_DIR = join(__dirname, '../src/styles/primitives-variables');

// Config for Style Dictionary
const config: Config = {
  source: [join(TOKENS_DIR, 'token_agds-global-primitives_Mode1.json')],
  platforms: {
    css: {
      transformGroup: 'css',
      transforms: ['name/custom/css'],
      buildPath: `${OUTPUT_DIR}/`,
      files: [
        {
          destination: 'root.css',
          format: 'css/variables',
          options: {
            showFileHeader: true,
            outputReferences: true
          }
        }
      ]
    }
  },
  transform: {
    'name/custom/css': {
      type: 'name',
      transformer: (token: TransformedToken): string => {
        // Convert the token path to kebab case
        const tokenPath = token.path.map((part: string): string => {
          // Handle spaces and convert to lowercase
          return part.replace(/\s+/g, '-').toLowerCase();
        });

        // Handle special cases for numbers followed by 'a'
        const processedPath = tokenPath.map((part: string): string => {
          // Replace patterns like "-100-a", "-30-a" with "100a", "30a"
          return part.replace(/(\d+)-a(?=[-\s]|$)/, '$1a');
        }).join('-');

        // Return the final CSS variable name
        return `--${processedPath}`;
      }
    }
  }
};

// Initialize Style Dictionary with our config
const sd = StyleDictionary.default.extend(config);

// Build all platforms
console.log('🚀 Building tokens...');
sd.buildAllPlatforms();
console.log('\n✨ Tokens build complete!'); 