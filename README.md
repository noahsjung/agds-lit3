# Design System with Lit

A modern design system built with Lit, providing reusable web components that follow design best practices.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Start Storybook:
```bash
npm run storybook
```

4. Build the library:
```bash
npm run build
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
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 