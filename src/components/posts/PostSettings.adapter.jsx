/**
 * PostSettings - Refactored to use UI Adapter
 * 
 * This version uses the UI adapter, allowing you to swap
 * between native, Mantine, MUI, or any other UI library
 * by changing one line in src/ui/index.js
 */

import { HelpCircle, ChevronDown } from 'lucide-react';
import { Select, TextInput } from '../../ui';
import './PostSettings.css';

export const PostSettings = ({ 
  apiMode,
  setApiMode,
  tone,
  setTone,
  format,
  setFormat,
  length,
  setLength,
  style,
  setStyle,
  customStyle,
  setCustomStyle,
  useEmoticons,
  setUseEmoticons,
  stream,
  setStream,
  temperature,
  setTemperature,
  topP,
  setTopP,
  seed,
  setSeed,
  isGenerating,
  collapsed,
  onToggle
}) => {
  return (
    <div className="document-info">
      <div className="document-info-header" onClick={onToggle}>
        <span className="document-info-title">Post Settings</span>
        <button className="collapse-toggle" aria-label={collapsed ? 'Expand' : 'Collapse'}>
          <ChevronDown size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
      </div>
      
      {!collapsed && (
        <div className="doc-info-content post-settings-content">
          <div className="setting-group">
            <Select
              label={
                <>
                  API Mode
                  <span className="tooltip-icon" title="Writer API generates more varied and creative suggestions. Rewriter API produces more consistent rewrites.">
                    <HelpCircle size={12} />
                  </span>
                </>
              }
              value={apiMode}
              onChange={setApiMode}
              disabled={isGenerating}
              options={[
                { value: 'writer', label: 'Writer' },
                { value: 'rewriter', label: 'Rewriter' }
              ]}
            />
          </div>

          <div className="setting-group">
            <Select
              label="Tone"
              value={tone}
              onChange={setTone}
              disabled={isGenerating}
              options={apiMode === 'writer' ? [
                { value: 'casual', label: 'Casual' },
                { value: 'neutral', label: 'Neutral' },
                { value: 'formal', label: 'Formal' }
              ] : [
                { value: 'more-casual', label: 'More Casual' },
                { value: 'as-is', label: 'As-Is' },
                { value: 'more-formal', label: 'More Formal' }
              ]}
            />
          </div>

          <div className="setting-group">
            <Select
              label="Format"
              value={format}
              onChange={setFormat}
              disabled={isGenerating}
              options={apiMode === 'writer' ? [
                { value: 'markdown', label: 'Markdown' },
                { value: 'plain-text', label: 'Plain Text' }
              ] : [
                { value: 'as-is', label: 'As-Is' },
                { value: 'markdown', label: 'Markdown' },
                { value: 'plain-text', label: 'Plain Text' }
              ]}
            />
          </div>

          <div className="setting-group">
            <Select
              label="Length"
              value={length}
              onChange={setLength}
              disabled={isGenerating}
              options={apiMode === 'writer' ? [
                { value: 'short', label: 'Short' },
                { value: 'medium', label: 'Medium' },
                { value: 'long', label: 'Long' }
              ] : [
                { value: 'shorter', label: 'Shorter' },
                { value: 'as-is', label: 'As-Is' },
                { value: 'longer', label: 'Longer' }
              ]}
            />
          </div>

          <div className="setting-group full-width">
            <Select
              label="Style"
              value={style}
              onChange={setStyle}
              disabled={isGenerating}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'humorous', label: 'Humorous' },
                { value: 'witty', label: 'Witty' },
                { value: 'sarcastic', label: 'Sarcastic' },
                { value: 'inspirational', label: 'Inspirational' },
                { value: 'motivational', label: 'Motivational' },
                { value: 'dramatic', label: 'Dramatic' },
                { value: 'mysterious', label: 'Mysterious' },
                { value: 'scary', label: 'Scary' },
                { value: 'angry', label: 'Angry' },
                { value: 'excited', label: 'Excited' },
                { value: 'calm', label: 'Calm' },
                { value: 'professional', label: 'Professional' },
                { value: 'friendly', label: 'Friendly' },
                { value: 'persuasive', label: 'Persuasive' },
                { value: 'storytelling', label: 'Storytelling' },
                { value: 'educational', label: 'Educational' },
                { value: 'controversial', label: 'Controversial' },
                { value: 'clickbait', label: 'Clickbait' },
                { value: 'custom', label: 'Custom...' }
              ]}
            />
          </div>

          {style === 'custom' && (
            <div className="setting-group full-width">
              <TextInput
                label="Custom Style"
                placeholder="e.g., poetic and romantic"
                value={customStyle}
                onChange={setCustomStyle}
                disabled={isGenerating}
              />
            </div>
          )}

          <div className="setting-group">
            <Select
              label="Emoticons"
              value={useEmoticons ? 'yes' : 'no'}
              onChange={(val) => setUseEmoticons(val === 'yes')}
              disabled={isGenerating}
              options={[
                { value: 'no', label: 'No Emojis' },
                { value: 'yes', label: 'With Emojis' }
              ]}
            />
          </div>

          <div className="setting-group">
            <Select
              label="Stream"
              value={stream ? 'yes' : 'no'}
              onChange={(val) => setStream(val === 'yes')}
              disabled={isGenerating}
              options={[
                { value: 'yes', label: 'On' },
                { value: 'no', label: 'Off' }
              ]}
            />
          </div>

          <div className="setting-group">
            <TextInput
              label={
                <>
                  Temperature
                  <span className="tooltip-icon" title="Controls randomness. Higher = more creative.">
                    <HelpCircle size={12} />
                  </span>
                </>
              }
              type="number"
              value={temperature}
              onChange={setTemperature}
              disabled={isGenerating}
            />
          </div>

          <div className="setting-group">
            <TextInput
              label={
                <>
                  Top P
                  <span className="tooltip-icon" title="Nucleus sampling for diversity.">
                    <HelpCircle size={12} />
                  </span>
                </>
              }
              type="number"
              value={topP}
              onChange={setTopP}
              disabled={isGenerating}
            />
          </div>

          <div className="setting-group full-width">
            <TextInput
              label={
                <>
                  Seed
                  <span className="tooltip-icon" title="For reproducible results.">
                    <HelpCircle size={12} />
                  </span>
                </>
              }
              placeholder="Optional"
              value={seed}
              onChange={setSeed}
              disabled={isGenerating}
            />
          </div>
        </div>
      )}
    </div>
  );
};
