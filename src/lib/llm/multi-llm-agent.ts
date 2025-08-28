// Multi-LLM Support for ELLU Studios AI Agent
// Supports OpenAI, Google Gemini, and Anthropic Claude

import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ADVANCED_SYSTEM_PROMPT } from '../agent/advanced-prompt';

export type LLMProvider = 'openai' | 'gemini' | 'claude';

export interface LLMSettings {
  provider: LLMProvider;
  temperature: number;
  maxTokens: number;
  topP?: number;
  topK?: number;
}

export class MultiLLMManager {
  private static defaultSettings: LLMSettings = {
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 500,
    topP: 1.0,
    topK: 40
  };

  static createLLM(settings: Partial<LLMSettings> = {}): BaseChatModel {
    const config = { ...this.defaultSettings, ...settings };

    switch (config.provider) {
      case 'openai':
        return new ChatOpenAI({
          model: "gpt-4-turbo-preview",
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          topP: config.topP,
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

      case 'gemini':
        return new ChatGoogleGenerativeAI({
          model: "gemini-1.5-pro",
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
          topP: config.topP,
          topK: config.topK,
          apiKey: process.env.GOOGLE_API_KEY,
        });

      case 'claude':
        return new ChatAnthropic({
          model: "claude-3-5-sonnet-20241022",
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          topP: config.topP,
          anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        });

      default:
        throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
  }

  static getProviderInfo(provider: LLMProvider) {
    const info = {
      openai: {
        name: 'OpenAI GPT-4',
        model: 'gpt-4-turbo-preview',
        costPer1kTokens: 0.03,
        strengths: 'Excellent reasoning, function calling',
        icon: '🤖'
      },
      gemini: {
        name: 'Google Gemini Pro',
        model: 'gemini-1.5-pro',
        costPer1kTokens: 0.007,
        strengths: 'Fast, multilingual, good context window',
        icon: '✨'
      },
      claude: {
        name: 'Anthropic Claude',
        model: 'claude-3-5-sonnet',
        costPer1kTokens: 0.015,
        strengths: 'Thoughtful, detailed analysis',
        icon: '🧠'
      }
    };

    return info[provider];
  }

  static validateEnvironment(): { [key in LLMProvider]: boolean } {
    return {
      openai: !!process.env.OPENAI_API_KEY,
      gemini: !!process.env.GOOGLE_API_KEY,
      claude: !!process.env.ANTHROPIC_API_KEY
    };
  }

  static getAvailableProviders(): LLMProvider[] {
    const env = this.validateEnvironment();
    return Object.entries(env)
      .filter(([_, available]) => available)
      .map(([provider, _]) => provider as LLMProvider);
  }
}