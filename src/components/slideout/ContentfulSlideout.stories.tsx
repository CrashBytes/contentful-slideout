import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { ContentfulSlideout, ContentfulEntry } from './ContentfulSlideout'

const mockSuperheroEntry: ContentfulEntry = {
  sys: {
    id: 'hero-001',
    contentType: { 
      sys: { id: 'superhero' },
      name: 'Superhero Character'
    },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    publishedAt: '2024-01-18T10:00:00Z',
    version: 12
  },
  sections: [
    {
      id: 'basicInfo',
      title: 'Hero Identity',
      collapsible: false,
      fields: [
        {
          id: 'heroName',
          name: 'Hero Name',
          type: 'text',
          value: 'Captain Cosmic',
          required: true,
          maxLength: 50,
          placeholder: 'Enter superhero name'
        },
        {
          id: 'realName',
          name: 'Secret Identity',
          type: 'text',
          value: 'Dr. Sarah Chen',
          required: true,
          maxLength: 100,
          helpText: 'The hero\'s real name (classified)'
        },
        {
          id: 'origin',
          name: 'Origin Story',
          type: 'textarea',
          value: 'Gained cosmic powers after being exposed to a mysterious meteor during a deep space research mission.',
          required: true,
          maxLength: 500,
          placeholder: 'How did they get their powers?'
        }
      ]
    },
    {
      id: 'powers',
      title: 'Powers & Abilities',
      collapsible: true,
      defaultCollapsed: false,
      fields: [
        {
          id: 'primaryPower',
          name: 'Primary Power',
          type: 'select',
          value: 'Cosmic Energy Manipulation',
          required: true,
          options: ['Super Strength', 'Flight', 'Telepathy', 'Cosmic Energy Manipulation', 'Time Control']
        },
        {
          id: 'powerLevel',
          name: 'Power Level (1-100)',
          type: 'number',
          value: 85,
          required: true,
          helpText: 'Overall power rating'
        },
        {
          id: 'canFly',
          name: 'Can Fly',
          type: 'boolean',
          value: true,
          required: false
        }
      ]
    }
  ],
  metadata: {
    tags: ['superhero', 'cosmic', 'space'],
    status: 'published'
  }
}

const mockPizzaEntry: ContentfulEntry = {
  sys: {
    id: 'pizza-supreme',
    contentType: { 
      sys: { id: 'menuItem' },
      name: 'Pizza Menu Item'
    },
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-22T16:20:00Z',
    version: 5
  },
  sections: [
    {
      id: 'pizzaBasics',
      title: 'Pizza Details',
      collapsible: false,
      fields: [
        {
          id: 'name',
          name: 'Pizza Name',
          type: 'text',
          value: 'The Supreme Overlord',
          required: true,
          maxLength: 50,
          placeholder: 'Enter pizza name'
        },
        {
          id: 'description',
          name: 'Description',
          type: 'textarea',
          value: 'A legendary pizza loaded with pepperoni, sausage, mushrooms, peppers, and extra cheese!',
          required: true,
          maxLength: 300
        },
        {
          id: 'category',
          name: 'Category',
          type: 'select',
          value: 'Specialty Pizza',
          required: true,
          options: ['Classic', 'Specialty Pizza', 'Vegetarian', 'Vegan']
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing',
      collapsible: true,
      defaultCollapsed: false,
      fields: [
        {
          id: 'price',
          name: 'Price (USD)',
          type: 'number',
          value: 22.99,
          required: true
        },
        {
          id: 'available',
          name: 'Currently Available',
          type: 'boolean',
          value: true,
          required: true
        }
      ]
    }
  ],
  metadata: {
    tags: ['pizza', 'specialty', 'popular'],
    status: 'published'
  }
}

const meta: Meta<typeof ContentfulSlideout> = {
  title: 'Components/ContentfulSlideout',
  component: ContentfulSlideout,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: {
      description: 'Controls whether the slideout is visible',
      control: 'boolean',
    },
    readOnly: {
      description: 'When true, fields are disabled',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const renderStory = (args: any) => (
  <div style={{ height: '100vh', position: 'relative', backgroundColor: '#f5f5f5' }}>
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
        🎮 Fun Content Management
      </h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Managing superheroes and pizza! The slideout appears from the left.
      </p>
    </div>
    <ContentfulSlideout {...args} />
  </div>
)

export const Superhero: Story = {
  args: {
    isOpen: true,
    entry: mockSuperheroEntry,
    readOnly: false,
    onClose: action('slideout-closed'),
    onSave: action('entry-saved'),
    onPublish: action('entry-published'),
    onPreview: action('entry-previewed'),
  },
  render: renderStory,
}

export const Pizza: Story = {
  args: {
    ...Superhero.args,
    entry: mockPizzaEntry,
  },
  render: renderStory,
}

export const ReadOnly: Story = {
  args: {
    ...Superhero.args,
    readOnly: true,
  },
  render: renderStory,
}

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [currentEntry, setCurrentEntry] = React.useState<ContentfulEntry>(mockSuperheroEntry)
    
    return (
      <div style={{ height: '100vh', position: 'relative', backgroundColor: '#f5f5f5' }}>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
            🎮 Interactive Demo
          </h1>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCurrentEntry(mockSuperheroEntry)
                setIsOpen(true)
              }}
            >
              🦸‍♀️ Edit Superhero
            </button>
            <button 
              style={{
                background: '#f97316',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCurrentEntry(mockPizzaEntry)
                setIsOpen(true)
              }}
            >
              🍕 Edit Pizza
            </button>
          </div>
        </div>
        
        <ContentfulSlideout
          isOpen={isOpen}
          entry={currentEntry}
          onClose={() => setIsOpen(false)}
          onSave={action('entry-saved')}
          onPublish={action('entry-published')}
          onPreview={action('entry-previewed')}
        />
      </div>
    )
  },
}
