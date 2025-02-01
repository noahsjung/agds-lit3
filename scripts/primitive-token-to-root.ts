#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types for our token structure
type TokenValue = {
  $type: string;
  $value: string | number;
};

type TokenObject = {
  [key: string]: TokenObject | TokenValue;
};

// Type guard to check if a value is a TokenValue
function isTokenValue(value: any): value is TokenValue {
  return value && '$type' in value && '$value' in value;
}

// Constants
const TOKENS_DIR = path.join(__dirname, '../tokens');
const OUTPUT_DIR = path.join(__dirname, '../src/styles/primitives-variables');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'root.css');

// Function to convert camelCase to kebab-case
const toKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Function to process variable name
const processVariableName = (category: string, path: string[]): string => {
  // Join the path with hyphens and convert to lowercase
  const processedPath = path.map(segment => {
    // Replace spaces with hyphens and convert to lowercase
    return segment.replace(/\s+/g, '-').toLowerCase();
  }).join('-');

  // Handle number-a patterns and spaces
  let finalPath = processedPath;
  
  // Replace spaces with hyphens first
  finalPath = finalPath.replace(/\s+/g, '-');
  
  // Handle the case where there's a hyphen before "a" after a number
  // This will match patterns like "-100-a", "-30-a", etc.
  finalPath = finalPath.replace(/(\d+)(?:-)a(?=[-\s]|$)/g, '$1a');
  
  // Handle any remaining cases where there's a hyphen before "a"
  finalPath = finalPath.replace(/(\d+)(?:-)a/g, '$1a');
  
  // Remove any duplicate hyphens that might have been created
  finalPath = finalPath.replace(/-+/g, '-');
  
  // Remove trailing hyphens
  finalPath = finalPath.replace(/-+$/g, '');

  // Final check for any remaining spaces and convert to hyphens
  finalPath = finalPath.replace(/\s+/g, '-');

  return `--${category}-${finalPath}`;
};

// Function to process tokens recursively and generate CSS variables
const processTokens = (
  tokens: TokenObject,
  category: string,
  result: { [key: string]: string[] } = {}
): { [key: string]: string[] } => {
  if (!result[category]) {
    result[category] = [];
  }

  function processNestedTokens(obj: TokenObject, path: string[] = []): void {
    for (const [key, value] of Object.entries(obj)) {
      const processedKey = toKebabCase(key);
      const currentPath = [...path, processedKey];

      if (isTokenValue(value)) {
        let cssValue = value.$value;
        const variableName = processVariableName(category, currentPath);

        if (value.$type === 'color' && typeof cssValue === 'string') {
          result[category].push(`  ${variableName}: ${cssValue};`);
        } else if (value.$type === 'number') {
          const numValue = Number(cssValue);
          result[category].push(`  ${variableName}: ${numValue === 0 ? '0' : `${numValue}px`};`);
        } else if (value.$type === 'string') {
          result[category].push(`  ${variableName}: ${cssValue};`);
        }
      } else {
        processNestedTokens(value as TokenObject, currentPath);
      }
    }
  }

  processNestedTokens(tokens);
  return result;
};

// Main execution
function generateRootCSS() {
  console.log('Generating root.css...\n');
  console.log('Token directory:', TOKENS_DIR);
  console.log('Output path:', OUTPUT_PATH);

  // Ensure tokens directory exists
  if (!fs.existsSync(TOKENS_DIR)) {
    console.error(`Token directory ${TOKENS_DIR} does not exist`);
    process.exit(1);
  }

  // Read the token file
  const tokenFilePath = path.join(TOKENS_DIR, 'token_agds-global-primitives_Mode1.json');
  console.log(`Processing primitives from: ${tokenFilePath}`);

  if (!fs.existsSync(tokenFilePath)) {
    console.error('Global primitives file not found');
    process.exit(1);
  }

  let fileContent: string;
  try {
    fileContent = fs.readFileSync(tokenFilePath, 'utf-8');
    console.log('Successfully read file');
    console.log('File content length:', fileContent.length);
  } catch (error) {
    console.error('Error reading file:', error);
    process.exit(1);
  }

  let tokens: any;
  try {
    tokens = JSON.parse(fileContent);
    console.log('Successfully parsed JSON');
    console.log('Available top-level keys:', Object.keys(tokens));
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.log('File content sample:', fileContent.slice(0, 200));
    process.exit(1);
  }

  // Process each token category
  const categories = {
    'colors': 'Color Tokens',
    'effects': 'Effect Tokens',
    'dimensions': 'Dimension Tokens',
    'text': 'Typography Tokens'
  };

  const timestamp = new Date().toISOString();
  const cssContent = [
    '/* ',
    ` * Generated on: ${timestamp}`,
    ' */',
    '',
    ':root {'
  ];

  try {
    for (const [category, sectionTitle] of Object.entries(categories)) {
      console.log(`Processing category: ${category}`);
      if (category in tokens) {
        console.log(`Found ${category} in tokens`);
        cssContent.push(`\n  /* ${sectionTitle} */`);
        const result = processTokens(tokens[category], category);
        if (result[category]) {
          console.log(`Generated ${result[category].length} properties for ${category}`);
          cssContent.push(...result[category]);
        }
      } else {
        console.log(`Category ${category} not found in tokens`);
      }
    }

    // Add font families
    cssContent.push('\n  /* Font Families */');
    cssContent.push('  --font-family-roboto: \'Roboto\', sans-serif;');
    cssContent.push('  --font-family-sofia-pro: \'Sofia Pro\', sans-serif;');

    cssContent.push('}');
    console.log('Total CSS content length:', cssContent.length);
  } catch (error) {
    console.error('Error processing tokens:', error);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    try {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating output directory:', error);
      process.exit(1);
    }
  }

  try {
    // Write the file
    fs.writeFileSync(OUTPUT_PATH, cssContent.join('\n'));
    console.log(`✓ Generated ${OUTPUT_PATH}`);
    console.log('\n✨ Root CSS generation complete!');
  } catch (error) {
    console.error('Error writing file:', error);
    process.exit(1);
  }
}

// Run the script
generateRootCSS();
