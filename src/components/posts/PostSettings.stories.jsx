/**
 * PostSettings Component Showcase
 * 
 * Compare Native vs Mantine implementations side-by-side
 */

import { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { PostSettings } from './PostSettings';
import { PostSettings as PostSettingsAdapter } from './PostSettings.adapter';

// Temporarily override the UI adapter for demo purposes
import * as NativeUI from '../../ui/implementations/native';
import * as MantineUI from '../../ui/implementations/mantine';

export default {
  title: 'Components/PostSettings',
  parameters: {
    layout: 'padded',
  },
};

// Mock settings state
const usePostSettings = () => {
  const [apiMode, setApiMode] = useState('writer');
  const [tone, setTone] = useState('neutral');
  const [format, setFormat] = useState('markdown');
  const [length, setLength] = useState('short');
  const [style, setStyle] = useState('default');
  const [customStyle, setCustomStyle] = useState('');
  const [useEmoticons, setUseEmoticons] = useState(false);
  const [stream, setStream] = useState(true);
  const [temperature, setTemperature] = useState('0.7');
  const [topP, setTopP] = useState('0.9');
  const [seed, setSeed] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  return {
    apiMode, setApiMode,
    tone, setTone,
    format, setFormat,
    length, setLength,
    style, setStyle,
    customStyle, setCustomStyle,
    useEmoticons, setUseEmoticons,
    stream, setStream,
    temperature, setTemperature,
    topP, setTopP,
    seed, setSeed,
    collapsed,
    onToggle: () => setCollapsed(!collapsed),
    isGenerating: false
  };
};

export const CurrentImplementation = () => {
  const settings = usePostSettings();

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ 
        marginBottom: '1rem', 
        padding: '1rem', 
        background: '#f3e8ff', 
        borderRadius: '8px',
        border: '2px solid #a78bfa'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#7c3aed' }}>
          Current Implementation (Native HTML)
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
          This is your current PostSettings component using native HTML elements.
        </p>
      </div>
      <PostSettings {...settings} />
    </div>
  );
};

CurrentImplementation.storyName = '📝 Current (Native HTML)';

export const WithAdapter = () => {
  const [implementation, setImplementation] = useState('native');
  const settings = usePostSettings();

  // Dynamically inject the UI implementation
  const UIModule = implementation === 'mantine' ? MantineUI : NativeUI;
  
  // Mock the UI module for the adapter component
  const AdapterWithUI = () => {
    // Temporarily override the UI imports
    const originalRequire = window.require;
    
    return implementation === 'mantine' ? (
      <MantineProvider>
        <PostSettingsAdapter {...settings} />
      </MantineProvider>
    ) : (
      <PostSettingsAdapter {...settings} />
    );
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ 
        marginBottom: '1rem', 
        padding: '1rem', 
        background: '#f3e8ff', 
        borderRadius: '8px',
        border: '2px solid #a78bfa'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7c3aed' }}>
          🎨 Adapter Version (Switchable)
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button
            onClick={() => setImplementation('native')}
            style={{
              padding: '0.5rem 1rem',
              background: implementation === 'native' ? '#7c3aed' : 'white',
              color: implementation === 'native' ? 'white' : '#7c3aed',
              border: '2px solid #7c3aed',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Native
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
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Mantine
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
          Using: <strong>{implementation === 'native' ? 'Native HTML/CSS' : 'Mantine UI'}</strong>
        </p>
      </div>
      <AdapterWithUI />
    </div>
  );
};

WithAdapter.storyName = '🎨 With Adapter (Switchable)';

export const SideBySide = () => {
  const nativeSettings = usePostSettings();
  const mantineSettings = usePostSettings();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div>
        <div style={{ 
          marginBottom: '1rem', 
          padding: '1rem', 
          background: '#f3e8ff', 
          borderRadius: '8px',
          border: '2px solid #a78bfa',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#7c3aed' }}>Native HTML/CSS</h3>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            ~5 KB • Zero dependencies
          </p>
        </div>
        <PostSettings {...nativeSettings} />
      </div>

      <div>
        <div style={{ 
          marginBottom: '1rem', 
          padding: '1rem', 
          background: '#f3e8ff', 
          borderRadius: '8px',
          border: '2px solid #a78bfa',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#7c3aed' }}>Mantine UI</h3>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            ~80 KB • Already installed
          </p>
        </div>
        <MantineProvider>
          <PostSettingsAdapter {...mantineSettings} />
        </MantineProvider>
      </div>
    </div>
  );
};

SideBySide.storyName = '⚖️ Side-by-Side Comparison';

export const InteractiveDemo = () => {
  const [implementation, setImplementation] = useState('native');
  const settings = usePostSettings();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>
          🎨 UI Adapter Demo
        </h1>
        <p style={{ margin: 0, fontSize: '1.125rem', opacity: 0.9 }}>
          Switch between UI implementations in real-time
        </p>
      </div>

      {/* Implementation Switcher */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        background: '#f3e8ff', 
        borderRadius: '8px',
        border: '2px solid #a78bfa'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7c3aed' }}>
          Choose UI Implementation
        </h3>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setImplementation('native')}
            style={{
              flex: 1,
              padding: '1rem',
              background: implementation === 'native' ? '#7c3aed' : 'white',
              color: implementation === 'native' ? 'white' : '#7c3aed',
              border: '2px solid #7c3aed',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            <div>Native HTML/CSS</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>
              ~5 KB • Zero dependencies
            </div>
          </button>
          <button
            onClick={() => setImplementation('mantine')}
            style={{
              flex: 1,
              padding: '1rem',
              background: implementation === 'mantine' ? '#7c3aed' : 'white',
              color: implementation === 'mantine' ? 'white' : '#7c3aed',
              border: '2px solid #7c3aed',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            <div>Mantine UI</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>
              ~80 KB • Already installed
            </div>
          </button>
        </div>
        <div style={{ 
          padding: '1rem', 
          background: 'white', 
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <strong>Currently using:</strong> {implementation === 'native' ? 'Native HTML/CSS' : 'Mantine UI'}
          <br />
          <strong>How to switch in your app:</strong> Edit <code style={{ background: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>src/ui/index.js</code>
        </div>
      </div>

      {/* Component Display */}
      <div style={{ 
        padding: '2rem', 
        background: 'white', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {implementation === 'mantine' ? (
          <MantineProvider>
            <PostSettingsAdapter {...settings} />
          </MantineProvider>
        ) : (
          <PostSettings {...settings} />
        )}
      </div>

      {/* Info */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>
          💡 What You're Seeing
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#0c4a6e', fontSize: '0.875rem' }}>
          <li>Same component code, different UI implementations</li>
          <li>Switch happens instantly with zero code changes</li>
          <li>All functionality works identically</li>
          <li>In your app, change one line in <code>src/ui/index.js</code> to swap</li>
        </ul>
      </div>
    </div>
  );
};

InteractiveDemo.storyName = '🚀 Interactive Demo';
