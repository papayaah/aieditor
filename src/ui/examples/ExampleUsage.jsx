/**
 * Example Component Using UI Adapter
 * 
 * This demonstrates how to use the UI adapter in your components.
 * The same code works with any UI implementation (native, shadcn, MUI, etc.)
 */

import { useState } from 'react';
import { 
  Button, 
  IconButton,
  Menu, 
  MenuItem,
  Modal, 
  TextInput, 
  Select, 
  Textarea,
  Switch 
} from '../index';
import { Settings, Save, Trash2 } from 'lucide-react';

export function ExampleUsage() {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [enabled, setEnabled] = useState(false);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h1>UI Adapter Example</h1>
      
      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Button variant="default" onClick={() => alert('Default')}>
          Default
        </Button>
        <Button variant="secondary" onClick={() => alert('Secondary')}>
          Secondary
        </Button>
        <Button variant="ghost" onClick={() => alert('Ghost')}>
          Ghost
        </Button>
        <Button variant="danger" onClick={() => alert('Danger')}>
          Danger
        </Button>
      </div>

      {/* Icon Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <IconButton aria-label="Save">
          <Save size={20} />
        </IconButton>
        <IconButton aria-label="Delete" variant="default">
          <Trash2 size={20} />
        </IconButton>
      </div>

      {/* Menu */}
      <div style={{ marginBottom: '2rem' }}>
        <Menu
          trigger={
            <Button variant="ghost">
              <Settings size={16} />
              Settings
            </Button>
          }
          open={showMenu}
          onOpenChange={setShowMenu}
        >
          <MenuItem icon={<Save size={16} />} onClick={() => alert('Save')}>
            Save
          </MenuItem>
          <MenuItem icon={<Trash2 size={16} />} onClick={() => alert('Delete')} variant="danger">
            Delete
          </MenuItem>
        </Menu>
      </div>

      {/* Form Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <TextInput
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Enter your name"
        />

        <Select
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

        <Textarea
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Enter a description"
          rows={4}
        />

        <Switch
          label="Enable notifications"
          checked={enabled}
          onChange={setEnabled}
        />
      </div>

      {/* Modal Trigger */}
      <Button onClick={() => setShowModal(true)}>
        Open Modal
      </Button>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        size="md"
      >
        <p>This is a modal dialog. It works the same regardless of which UI library you use!</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowModal(false)}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
