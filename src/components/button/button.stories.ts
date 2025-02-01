import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './button';

const meta = {
  title: 'Components/Button',
  component: 'agds-button',
  tags: ['autodocs'],
  argTypes: {
    'data-theme': {
      control: 'select',
      options: ['ugds', 'marlo'],
      defaultValue: 'ugds',
    },
    'data-mode': {
      control: 'select',
      options: ['light', 'dark'],
      defaultValue: 'light',
    },
    'data-display': {
      control: 'select',
      options: ['mobile', 'tablet', 'desktop', '4k', 'flacs', 'florence', 'compass', 'udx', 'urs'],
      defaultValue: 'desktop',
    },
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    'data-theme': 'ugds',
    'data-mode': 'light',
    'data-display': 'desktop',
    disabled: false,
  },
  render: (args) => html`
    <agds-button
      data-theme=${args['data-theme']}
      data-mode=${args['data-mode']}
      data-display=${args['data-display']}
      ?disabled=${args.disabled}
    >
      Button
    </agds-button>
  `,
};

export const ThemeShowcase: Story = {
  render: () => html`
    <div style="display: grid; gap: 2rem;">
      <div>
        <h3>UGDS Light</h3>
        <agds-button data-theme="ugds" data-mode="light">UGDS Light Button</agds-button>
      </div>
      <div>
        <h3>UGDS Dark</h3>
        <agds-button data-theme="ugds" data-mode="dark">UGDS Dark Button</agds-button>
      </div>
      <div>
        <h3>Marlo Light</h3>
        <agds-button data-theme="marlo" data-mode="light">Marlo Light Button</agds-button>
      </div>
      <div>
        <h3>Marlo Dark</h3>
        <agds-button data-theme="marlo" data-mode="dark">Marlo Dark Button</agds-button>
      </div>
    </div>
  `,
}; 