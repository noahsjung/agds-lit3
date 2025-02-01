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
  formattedName = formattedName.replace(/(\d+)-a$/i, '$1a');
  
  return formattedName;
};

// Function to process token values and create CSS variables
function processTokens(tokens: Record<string, any>, prefix = ''): string[] {
  const cssVariables: string[] = [];

  for (const [key, value] of Object.entries(tokens)) {
    const formattedName = formatVariableName(key);
    const variableName = prefix ? `${prefix}-${formattedName}` : formattedName;

    if (typeof value === 'object' && value !== null) {
      if ('$value' in value) {
        // Handle token with $value property
        const tokenValue = value.$value;
        
        // Check if the value is a pure number
        const isNumeric = !isNaN(Number(tokenValue)) && String(tokenValue).trim() !== '';
        
        // Skip adding px for:
        // 1. Non-numeric values
        // 2. Values that already have units (contain letters)
        // 3. Values that are opacity-related (contain 'a' suffix)
        // 4. Zero values
        // 5. Color values (hex or rgba)
        const skipPx = !isNumeric || 
                      /[a-z%]/i.test(String(tokenValue)) || 
                      variableName.endsWith('a') || 
                      tokenValue === 0 ||
                      /^#|rgba/.test(String(tokenValue));
        
        const processedValue = skipPx ? tokenValue : `${tokenValue}px`;
        cssVariables.push(`  --${variableName}: ${processedValue};`);
      } else {
        // Recurse into nested objects
        cssVariables.push(...processTokens(value, variableName));
      }
    } else {
      // Handle direct values (not wrapped in object with $value)
      const isNumeric = !isNaN(Number(value)) && String(value).trim() !== '';
      
      // Skip adding px for:
      // 1. Non-numeric values
      // 2. Values that already have units (contain letters)
      // 3. Values that are opacity-related (contain 'a' suffix)
      // 4. Zero values
      // 5. Color values (hex or rgba)
      const skipPx = !isNumeric || 
                    /[a-z%]/i.test(String(value)) || 
                    variableName.endsWith('a') || 
                    value === 0 ||
                    /^#|rgba/.test(String(value));
      
      const processedValue = skipPx ? value : `${value}px`;
      cssVariables.push(`  --${variableName}: ${processedValue};`);
    }
  }

  return cssVariables;
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