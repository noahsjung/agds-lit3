# AGDS Lit3

A modern design system built with Lit and TypeScript, featuring theme support for UGDS and Marlo.

## Features

- Built with Lit 3.0 and TypeScript
- Theme support (UGDS and Marlo)
- Display-specific styles
- Medical display support
- Design token management with Style Dictionary
- Storybook integration for component documentation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

```bash
npm install
```

### Development

Start the development server:
```bash
npm start
```

Run Storybook:
```bash
npm run storybook
```

### Building

Build the library:
```bash
npm run build
```

Generate CSS variables from design tokens:
```bash
npm run generate:css
```

### Testing

Run tests:
```bash
npm test
```

Run Storybook tests:
```bash
npm run storybook:test
```

## Project Structure

```
agds-lit3/
├── src/
│   ├── components/       # Web components
│   │   ├── button/
│   │   ├── ds-button/
│   │   ├── ds-card/
│   │   ├── ds-input/
│   │   ├── ds-modal/
│   │   └── ds-notification/
│   │
│   ├── styles/          # CSS styles and variables
│   │   ├── primitives-variables/    # Generated token variables
│   │   ├── semantics-variables/     # Theme-specific variables
│   │   └── component-variables/     # Component-specific variables
│   │
│   └── utils/           # Utility functions
│
├── scripts/            # Build and utility scripts
│
├── tokens/             # Design token JSON files
│
├── stories/           # Storybook stories
│
└── test/              # Test files
```

## Development

- `npm start` - Start the development server
- `npm run storybook` - Start Storybook development environment
- `npm run build` - Build the library
- `npm run build-storybook` - Build Storybook for static deployment
- `npm run lint` - Run linting
- `npm run format` - Format code
- `npm test` - Run tests
- `npm run storybook:test` - Run Storybook tests

## Usage

### Import Components

```javascript
// Import specific components
import '@your-org/design-system/dist/components/button';

// Or import everything
import '@your-org/design-system';
```

### Use Components

```html
<!-- Button Component -->
<ds-button>Click me</ds-button>
<ds-button variant="secondary">Secondary</ds-button>
<ds-button disabled>Disabled</ds-button>
```

### Event Handling

```javascript
const button = document.querySelector('ds-button');
button.addEventListener('ds-click', (e) => {
    console.log('Button clicked:', e.detail);
});
```

## Component Documentation

### Button (`<ds-button>`)

Properties:
- `variant`: 'primary' | 'secondary' (default: 'primary')
- `disabled`: boolean (default: false)

Events:
- `ds-click`: Fired when the button is clicked. Event detail contains the original click event.

## Storybook

Our component library uses Storybook for development, testing, and documentation. Each component has its own set of stories that demonstrate its usage and variants.

To view the components in Storybook:

1. Start Storybook:
```bash
npm run storybook
```

2. Open your browser and navigate to `http://localhost:6006`

### Writing Stories

Stories are located in `.stories.ts` files alongside their components. Each story represents a different state or variant of the component.

Example:
```typescript
export const Primary: Story = {
  args: {
    variant: 'primary',
    slot: 'Primary Button',
    disabled: false,
  },
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC 