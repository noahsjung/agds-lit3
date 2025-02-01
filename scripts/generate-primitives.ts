import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the token file
const tokenFile = path.join(__dirname, '../tokens/token_agds-global-primitives_Mode1.json');
const outputFile = path.join(__dirname, '../src/styles/primitives-variables/primitive-variables.css');

// Function to convert camelCase or PascalCase to kebab-case and handle spaces
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
};

// Function to format variable name with proper number formatting
const formatVariableName = (name: string): string => {
  // First convert to kebab case
  let formattedName = toKebabCase(name);
  
  // Handle the number+a suffix by removing any hyphens before the 'a'
  formattedName = formattedName.replace(/(\d+)-(\d+)-?a$/i, '$1-$2a');
  
  return formattedName;
};

// Function to process token values and create CSS variables
function processTokens(obj: any, prefix: string = ''): string[] {
  const variables: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    // Replace spaces with hyphens in the key
    const processedKey = key.replace(/\s+/g, '-');
    const newPrefix = prefix ? `${prefix}-${toKebabCase(processedKey)}` : toKebabCase(processedKey);

    if (value && typeof value === 'object') {
      if ('$value' in value) {
        // Handle direct value
        const varName = formatVariableName(newPrefix);
        variables.push(`  --${varName}: ${value.$value};`);
      } else {
        // Recurse into nested objects
        variables.push(...processTokens(value, newPrefix));
      }
    }
  }

  return variables;
}

try {
  // Read and parse the token file
  const tokenData = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));

  // Generate timestamp
  const timestamp = new Date().toISOString();

  // Process tokens and create CSS content
  const cssVariables = processTokens(tokenData);
  
  // Create the CSS content with header comment
  const cssContent = `/**
 * Generated from token_agds-global-primitives_Mode1.json
 * Generated on: ${timestamp}
 */

:root {
${cssVariables.join('\n')}
}
`;

  // Write the CSS file
  fs.writeFileSync(outputFile, cssContent);
  console.log('Successfully generated primitive-variables.css');

} catch (error) {
  console.error('Error generating CSS variables:', error);
  process.exit(1);
} 