import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

const Welcome = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Welcome to Storybook!
      </h1>
      <p style={{ color: '#666', lineHeight: '1.6' }}>
        This is your Storybook for the FlexibleSlideout component.
        Once this loads successfully, we can add the slideout stories.
      </p>
    </div>
  )
}

const meta: Meta<typeof Welcome> = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
