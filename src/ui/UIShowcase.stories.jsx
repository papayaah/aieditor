/**
 * UI Adapter Showcase
 * 
 * This story lets you switch between different UI implementations
 * (Native, Mantine, MUI) to see how they look and feel.
 */

import { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { Sparkles, Save, Settings, Trash2 } from 'lucide-react';

// Import all implementations
import * as NativeUI from './implementations/native';
import * as MantineUI from './implementations/mantine';

export default {
  title: 'UI Adapter/Showcase',
  parameters: {
    layout: 'padded',
  },
};

// Wrapper to provide Mantine context when needed
const UIProvider = ({ implementation, children }) => {
  if (implementation === 'mantine') {
    return (
      <MantineProvider>
        {children}
      </MantineProvider>
    );
  }
  return children;
};

// Get the UI components based on implementation
const getUI = (implementation) => {
  switch (implementation) {
    case 'mantine':
      return MantineUI;
    case 'native':
    default:
      return NativeUI;
  }
};

export const AllComponents = () => {
  const [implementation, setImplementation] = useState('native');
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(false);

  const UI = getUI(implementation);

  return (
    <UIProvider implementation={implementation}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Implementation Switcher */}
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1rem', 
          background: '#f3e8ff', 
          borderRadius: '8px',
          border: '2px solid #a78bfa'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#7c3aed' }}>
            🎨 Choose UI Implementation
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setImplementation('native')}
              style={{
                padding: '0.5rem 1rem',
                background: implementation === 'native' ? '#7c3aed' : 'white',
                color: implementation === 'native' ? 'white' : '#7c3aed',
                border: '2px solid #7c3aed',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Native HTML/CSS
            </button>
            <button
              onClick={() => setImplementation('mantine')}
              style={{
                padding: '0.5rem 1rem',
                background: implementation === 'mantine' ? '#7c3aed' : 'white',
                color: implementation === 'mantine' ? 'white' : '#7c3aed',
                border: '2px solid #7c3aed',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Mantine UI
            </button>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            Currently using: <strong>{implementation === 'native' ? 'Native HTML/CSS' : 'Mantine UI'}</strong>
          </p>
        </div>

        {/* Buttons Section */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Buttons</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <UI.Button variant="default" onClick={() => alert('Default clicked!')}>
              Default
            </UI.Button>
            <UI.Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
              Secondary
            </UI.Button>
            <UI.Button variant="ghost" onClick={() => alert('Ghost clicked!')}>
              Ghost
            </UI.Button>
            <UI.Button variant="danger" onClick={() => alert('Danger clicked!')}>
              Danger
            </UI.Button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <UI.Button variant="default" size="sm">Small</UI.Button>
            <UI.Button variant="default" size="md">Medium</UI.Button>
            <UI.Button variant="default" size="lg">Large</UI.Button>
          </div>
        </section>

        {/* Icon Buttons Section */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Icon Buttons</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <UI.IconButton aria-label="Save">
              <Save size={20} />
            </UI.IconButton>
            <UI.IconButton aria-label="Settings">
              <Settings size={20} />
            </UI.IconButton>
            <UI.IconButton aria-label="Delete" variant="default">
              <Trash2 size={20} />
            </UI.IconButton>
          </div>
        </section>

        {/* Menu Section */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Menu</h2>
          <UI.Menu
            trigger={
              <UI.Button variant="ghost">
                <Settings size={16} />
                Open Menu
              </UI.Button>
            }
            open={showMenu}
            onOpenChange={setShowMenu}
          >
            <UI.MenuItem icon={<Save size={16} />} onClick={() => alert('Save clicked!')}>
              Save
            </UI.MenuItem>
            <UI.MenuItem icon={<Settings size={16} />} onClick={() => alert('Settings clicked!')}>
              Settings
            </UI.MenuItem>
            <UI.MenuItem icon={<Trash2 size={16} />} onClick={() => alert('Delete clicked!')} variant="danger">
              Delete
            </UI.MenuItem>
          </UI.Menu>
        </section>

        {/* Form Inputs Section */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Form Inputs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <UI.TextInput
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Enter your name"
            />

            <UI.TextInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />

            <UI.Select
              label="Category"
              value={category}
              onChange={setCategory}
              placeholder="Select a category"
              options={[
                { value: 'work', label: 'Work' },
                { value: 'personal', label: 'Personal' },
                { value: 'other', label: 'Other' }
              ]}
            />

            <UI.Textarea
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Enter a description"
              rows={4}
            />

            <UI.Switch
              label="Enable notifications"
              checked={enabled}
              onChange={setEnabled}
            />
          </div>
        </section>

        {/* Modal Section */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Modal</h2>
          <UI.Button onClick={() => setShowModal(true)}>
            Open Modal
          </UI.Button>

          <UI.Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            title="Example Modal"
            size="md"
          >
            <div style={{ marginBottom: '1rem' }}>
              <p>This is a modal dialog. It works the same regardless of which UI library you use!</p>
              <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                Try switching between Native and Mantine implementations above to see the difference.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <UI.Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </UI.Button>
              <UI.Button onClick={() => setShowModal(false)}>
                Confirm
              </UI.Button>
            </div>
          </UI.Modal>
        </section>

        {/* Info Box */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>
            💡 How It Works
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#0c4a6e' }}>
            All components above use the same code. The only difference is which implementation 
            is active. In your app, you can switch implementations by changing one line in 
            <code style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>
              src/ui/index.js
            </code>
          </p>
        </div>
      </div>
    </UIProvider>
  );
};

AllComponents.storyName = '🎨 All Components (Switchable)';
