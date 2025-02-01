import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define input and output paths
const tokenFile = path.join(__dirname, '../tokens/token_agds-components_Mode.json');
const outputFile = path.join(__dirname, '../src/styles/component-variables/component-variables.css');

// Function to convert camelCase or PascalCase to kebab-case and handle spaces
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
};

// Function to process token values and create CSS variables
function processTokens(obj: any, componentName: string, prefix: string = ''): string[] {
  const variables: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const processedKey = key.replace(/\s+/g, '-');
    const newPrefix = prefix 
      ? `${componentName}-${prefix}-${toKebabCase(processedKey)}` 
      : `${componentName}-${toKebabCase(processedKey)}`;

    if (value && typeof value === 'object') {
      if ('$value' in value && typeof value.$value === 'string') {
        // Handle direct value - remove curly braces and format references
        const processedValue = value.$value.replace(/[{}]/g, '');
        let finalValue = processedValue;

        // Handle semantic and primitive variable references
        if (!processedValue.startsWith('var(--') && 
            (processedValue.includes('.') || processedValue.includes('-')) &&
            key !== 'version') { // Don't wrap version values in var()
          finalValue = `var(--${processedValue.toLowerCase().replace(/\./g, '-')})`;
        }

        variables.push(`  --${newPrefix}: ${finalValue};`);
      } else {
        // Skip component metadata fields
        if (!['$type', 'component-name', 'version'].includes(key)) {
          // Recurse into nested objects
          variables.push(...processTokens(value, componentName, prefix ? `${prefix}-${toKebabCase(processedKey)}` : toKebabCase(processedKey)));
        }
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
 * - token_agds-components_Mode.json
 * Generated on: ${timestamp}
 */

@import url('../primitives-variables/index.css');
@import url('../semantics-variables/index.css');

`;

  // Read and parse the token file
  const tokenData = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));

  // Process each component
  for (const [componentName, componentData] of Object.entries(tokenData)) {
    // Add component comment
    cssContent += `
/* ${componentName.toUpperCase()} Component Variables
 * These variables are specific to the ${componentName} component and its variants.
 */
:root[data-theme][data-mode],
*[data-theme][data-mode] {
${processTokens(componentData, componentName).join('\n')}
}

`;
  }

  // Write the CSS file
  fs.writeFileSync(outputFile, cssContent);
  console.log('Successfully generated component-variables.css');

} catch (error) {
  console.error('Error generating CSS variables:', error);
  process.exit(1);
} 