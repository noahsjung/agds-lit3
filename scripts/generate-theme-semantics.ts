import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define input and output paths
const tokenFiles = {
  'ugds-light': path.join(__dirname, '../tokens/token_agds-brand-theme-semantics_ugds-light-mode.json'),
  'ugds-dark': path.join(__dirname, '../tokens/token_agds-brand-theme-semantics_ugds-dark-mode.json'),
  'marlo-light': path.join(__dirname, '../tokens/token_agds-brand-theme-semantics_marlo-light-mode.json'),
  'marlo-dark': path.join(__dirname, '../tokens/token_agds-brand-theme-semantics_marlo-dark-mode.json'),
};

const outputFile = path.join(__dirname, '../src/styles/semantics-variables/theme-semantic-variables.css');

// Function to convert camelCase or PascalCase to kebab-case and handle spaces
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
};

// Function to process token values and create CSS variables
function processTokens(obj: any, prefix: string = ''): string[] {
  const variables: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const processedKey = key.replace(/\s+/g, '-');
    const newPrefix = prefix ? `${prefix}-${toKebabCase(processedKey)}` : toKebabCase(processedKey);

    if (value && typeof value === 'object') {
      if ('$value' in value && typeof value.$value === 'string') {
        // Handle direct value - remove curly braces and format references
        const processedValue = value.$value.replace(/[{}]/g, '');
        let finalValue = processedValue;

        // Handle primitive variable references (colors and effects)
        if (processedValue.startsWith('colors.') || processedValue.startsWith('effects.')) {
          // Convert dots to hyphens and make lowercase
          finalValue = `var(--${processedValue.toLowerCase().replace(/\./g, '-')})`;
        } else if (!processedValue.startsWith('var(--')) {
          // Handle other variable references
          finalValue = `var(--${processedValue.replace(/\./g, '-')})`;
        }

        variables.push(`  --${newPrefix}: ${finalValue};`);
      } else {
        // Recurse into nested objects
        variables.push(...processTokens(value, newPrefix));
      }
    }
  }

  return variables;
}

try {
  // Generate timestamp
  const timestamp = new Date().toISOString();

  // Create the CSS content with header comment
  let cssContent = `/**
 * Generated from:
 * - token_agds-brand-theme-semantics_ugds-light-mode.json
 * - token_agds-brand-theme-semantics_ugds-dark-mode.json
 * - token_agds-brand-theme-semantics_marlo-light-mode.json
 * - token_agds-brand-theme-semantics_marlo-dark-mode.json
 * Generated on: ${timestamp}
 */

@import url('../index.css');

`;

  // Process each theme file
  for (const [themeKey, filePath] of Object.entries(tokenFiles)) {
    const [theme, mode] = themeKey.split('-');
    const tokenData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const cssVariables = processTokens(tokenData);

    cssContent += `
:root[data-theme='${theme}'][data-mode='${mode}'],
*[data-theme='${theme}'][data-mode='${mode}'] {
${cssVariables.join('\n')}
}
`;
  }

  // Write the CSS file
  fs.writeFileSync(outputFile, cssContent);
  console.log('Successfully generated theme-semantic-variables.css');

} catch (error) {
  console.error('Error generating CSS variables:', error);
  process.exit(1);
} 