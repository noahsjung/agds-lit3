import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define input and output paths
const tokenFiles = {
  'compass': '../tokens/token_agds-display-semantics_compass.json',
  'desktop': '../tokens/token_agds-display-semantics_desktop.json',
  'flacs-800': '../tokens/token_agds-display-semantics_flacs-800.json',
  'flacs-1920': '../tokens/token_agds-display-semantics_flacs-1920.json',
  'florence-800': '../tokens/token_agds-display-semantics_florence-800.json',
  'florence-1920': '../tokens/token_agds-display-semantics_florence-1920.json',
  'four-k': '../tokens/token_agds-display-semantics_four-k.json',
  'mobile': '../tokens/token_agds-display-semantics_mobile.json',
  'tablet': '../tokens/token_agds-display-semantics_tablet.json',
  'udx': '../tokens/token_agds-display-semantics_udx.json',
  'urs-od': '../tokens/token_agds-display-semantics_urs-od.json',
  'urs-portal': '../tokens/token_agds-display-semantics_urs-portal.json',
  'urs-surgeon': '../tokens/token_agds-display-semantics_urs-surgeon.json'
};

const outputFile = path.join(__dirname, '../src/styles/semantics-variables/display-semantic-variables.css');

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

        // Special handling for display-device-type and display-ppi
        if (newPrefix === 'display-device-type' || newPrefix === 'display-ppi') {
          // If it's a number or contains spaces, use as is without var()
          if (!isNaN(Number(processedValue)) || processedValue.includes(' ')) {
            finalValue = processedValue.toLowerCase();
          } else {
            finalValue = `var(--${processedValue.toLowerCase().replace(/\./g, '-')})`;
          }
        } else if (!processedValue.startsWith('var(--')) {
          // Handle other primitive variable references
          finalValue = `var(--${processedValue.toLowerCase().replace(/\./g, '-')})`;
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
${Object.entries(tokenFiles)
  .map(([_, filePath]) => ` * - ${path.basename(filePath)}`)
  .join('\n')}
 * Generated on: ${timestamp}
 */

@import url('../index.css');

`;

  // Process each display file
  for (const [displayName, filePath] of Object.entries(tokenFiles)) {
    const fullPath = path.join(__dirname, filePath);
    const tokenData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const cssVariables = processTokens(tokenData);

    cssContent += `
[data-display="${displayName}"] {
${cssVariables.join('\n')}
}
`;
  }

  // Write the CSS file
  fs.writeFileSync(outputFile, cssContent);
  console.log('Successfully generated display-semantic-variables.css');

} catch (error) {
  console.error('Error generating CSS variables:', error);
  process.exit(1);
} 