import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button';

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: (args) => html`
    <ds-button ?disabled=${args.disabled}>
      ${args.slot}
    </ds-button>
  `,
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    slot: {
      control: 'text',
      description: 'The button text content'
    }
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    slot: 'Button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    slot: 'Disabled Button',
    disabled: true,
  },
}; 