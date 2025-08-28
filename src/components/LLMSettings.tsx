// LLM Settings Component with Multi-Model Support
// Allows users to select between OpenAI, Gemini, Claude and adjust parameters

'use client';

import React, { useState, useEffect } from 'react';
import { LLMProvider, LLMSettings, MultiLLMManager } from '@/lib/llm/multi-llm-agent';

interface LLMSettingsProps {
  settings: LLMSettings;
  onSettingsChange: (settings: LLMSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function LLMSettingsPanel({ settings, onSettingsChange, isOpen, onClose }: LLMSettingsProps) {
  const [localSettings, setLocalSettings] = useState<LLMSettings>(settings);
  const [availableProviders, setAvailableProviders] = useState<LLMProvider[]>([]);

  useEffect(() => {
    setAvailableProviders(MultiLLMManager.getAvailableProviders());
  }, []);

  const handleChange = (key: keyof LLMSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const providerInfo = MultiLLMManager.getProviderInfo(localSettings.provider);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">AI Model Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* LLM Provider Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Provider
          </label>
          <div className="space-y-3">
            {availableProviders.map((provider) => {
              const info = MultiLLMManager.getProviderInfo(provider);
              return (
                <div key={provider} className="flex items-center">
                  <input
                    type="radio"
                    id={provider}
                    name="provider"
                    value={provider}
                    checked={localSettings.provider === provider}
                    onChange={(e) => handleChange('provider', e.target.value as LLMProvider)}
                    className="mr-3"
                  />
                  <label htmlFor={provider} className="flex-1 cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{info.icon}</span>
                      <div>
                        <div className="font-medium">{info.name}</div>
                        <div className="text-sm text-gray-500">
                          {info.model} • ${info.costPer1kTokens}/1k tokens
                        </div>
                        <div className="text-sm text-gray-600">{info.strengths}</div>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
          
          {availableProviders.length === 1 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="text-sm text-yellow-800">
                <strong>Note:</strong> Only OpenAI is available. Add GOOGLE_API_KEY and ANTHROPIC_API_KEY 
                to your .env.local file to enable Gemini and Claude.
              </div>
            </div>
          )}
        </div>

        {/* Current Provider Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">{providerInfo.icon}</span>
            <span className="font-medium">{providerInfo.name}</span>
          </div>
          <div className="text-sm text-blue-700">
            <div>Model: {providerInfo.model}</div>
            <div>Cost: ${providerInfo.costPer1kTokens} per 1k tokens</div>
            <div>Strengths: {providerInfo.strengths}</div>
          </div>
        </div>

        {/* Temperature Setting */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature: {localSettings.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={localSettings.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Focused (0.0)</span>
            <span>Balanced (1.0)</span>
            <span>Creative (2.0)</span>
          </div>
        </div>

        {/* Max Tokens Setting */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Response Length: {localSettings.maxTokens} tokens
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={localSettings.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Short (100)</span>
            <span>Medium (500)</span>
            <span>Long (2000)</span>
          </div>
        </div>

        {/* Advanced Settings for specific providers */}
        {(localSettings.provider === 'gemini' || localSettings.provider === 'claude') && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Settings</h3>
            
            {/* Top P Setting */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top P: {localSettings.topP}
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={localSettings.topP || 1.0}
                onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-xs text-gray-500 mt-1">
                Controls diversity via nucleus sampling
              </div>
            </div>

            {/* Top K Setting (Gemini only) */}
            {localSettings.provider === 'gemini' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top K: {localSettings.topK}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={localSettings.topK || 40}
                  onChange={(e) => handleChange('topK', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Number of top tokens to consider
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cost Estimator */}
        <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-1">Cost Estimation</div>
          <div className="text-sm text-gray-600">
            With current settings, a typical conversation (10 messages) will cost approximately{' '}
            <span className="font-mono font-medium">
              ${((localSettings.maxTokens * 10 * 2) * (providerInfo.costPer1kTokens / 1000)).toFixed(4)}
            </span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">Quick Presets</div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                const preset = { ...localSettings, temperature: 0.3, maxTokens: 300 };
                setLocalSettings(preset);
                onSettingsChange(preset);
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
            >
              🎯 Focused
            </button>
            <button
              onClick={() => {
                const preset = { ...localSettings, temperature: 0.7, maxTokens: 500 };
                setLocalSettings(preset);
                onSettingsChange(preset);
              }}
              className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
            >
              ⚖️ Balanced
            </button>
            <button
              onClick={() => {
                const preset = { ...localSettings, temperature: 1.2, maxTokens: 800 };
                setLocalSettings(preset);
                onSettingsChange(preset);
              }}
              className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
            >
              🎨 Creative
            </button>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}