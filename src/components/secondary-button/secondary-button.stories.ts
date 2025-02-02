import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './secondary-button';

const meta = {
  title: 'Components/SecondaryButton',
  tags: ['autodocs'],
  render: (args) => html`
    <agds-secondary-button
      ?disabled=${args.disabled}
    >
      Secondary Button
    </agds-secondary-button>
  `,
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}; 