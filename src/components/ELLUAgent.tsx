// ELLU Studios AI Agent Chat Interface
// Following CLAUDE.md requirements and GitHub standards

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SessionManager } from '@/lib/storage/session-manager';
import { LLMSettingsPanel } from '@/components/LLMSettings';
import { LLMSettings } from '@/lib/llm/multi-llm-agent';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  lastActivity: Date;
}

interface AgentResponse {
  response: string;
  blocked?: boolean;
  sessionId: string;
  timestamp: string;
  tokensUsed?: number;
}

export function ELLUAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => uuidv4());
  const [error, setError] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [llmSettings, setLLMSettings] = useState<LLMSettings>({
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 500,
    topP: 1.0,
    topK: 40
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = SessionManager.loadSessions();
    if (savedSessions.length > 0) {
      setChatSessions(savedSessions);
      setCurrentSessionIndex(0);
      setSessionId(savedSessions[0].id);
      setMessages(savedSessions[0].messages);
      // Calculate total tokens from all sessions
      const totalTokens = savedSessions.reduce((sum, session) => sum + (session.tokensUsed || 0), 0);
      setTotalTokens(totalTokens);
    } else {
      // Create initial session if none exist
      const initialSession: ChatSession = {
        id: sessionId,
        name: 'New Chat',
        messages: [],
        lastActivity: new Date()
      };
      setChatSessions([initialSession]);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      SessionManager.saveSessions(chatSessions);
    }
  }, [chatSessions]);

  // Update current session with messages
  useEffect(() => {
    if (chatSessions.length > 0) {
      const updatedSessions = [...chatSessions];
      updatedSessions[currentSessionIndex] = {
        ...updatedSessions[currentSessionIndex],
        messages: messages,
        lastActivity: new Date(),
        name: messages.length > 0 
          ? messages[0]?.content.slice(0, 30) + (messages[0]?.content.length > 30 ? '...' : '')
          : 'New Chat'
      };
      setChatSessions(updatedSessions);
    }
  }, [messages, currentSessionIndex, chatSessions]);

  const createNewChat = () => {
    const newSessionId = uuidv4();
    const newSession: ChatSession = {
      id: newSessionId,
      name: 'New Chat',
      messages: [],
      lastActivity: new Date()
    };
    
    setChatSessions(prev => [...prev, newSession]);
    setCurrentSessionIndex(chatSessions.length);
    setSessionId(newSessionId);
    setMessages([]);
    setError(null);
  };

  const switchToSession = (index: number) => {
    setCurrentSessionIndex(index);
    setSessionId(chatSessions[index].id);
    setMessages(chatSessions[index].messages);
    setError(null);
  };

  const deleteSession = (index: number) => {
    if (chatSessions.length <= 1) return; // Don't delete the last session
    
    const newSessions = chatSessions.filter((_, i) => i !== index);
    setChatSessions(newSessions);
    
    if (index === currentSessionIndex) {
      // Switch to previous session or first if we deleted the first
      const newIndex = index > 0 ? index - 1 : 0;
      setCurrentSessionIndex(newIndex);
      setSessionId(newSessions[newIndex].id);
      setMessages(newSessions[newIndex].messages);
    } else if (index < currentSessionIndex) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    }
  };

  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: uuidv4(),
      role: 'agent',
      content: `Willkommen bei ELLU Studios! Ich bin Ihre digitale Concierge und helfe Ihnen dabei, die perfekten Schnittkonstruktions- und Modedesign-Kurse zu entdecken.

Egal ob Sie Anfänger sind oder Ihre Fähigkeiten erweitern möchten, ich führe Sie durch unsere Lernwege, um genau das zu finden, was Sie suchen.

Wie kann ich Ihnen heute bei Ihrem Start in die Modeausbildung helfen?

(Feel free to respond in English if you prefer!)`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          sessionId: sessionId,
          llmSettings: llmSettings,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AgentResponse = await response.json();

      const agentMessage: Message = {
        id: uuidv4(),
        role: 'agent',
        content: data.response,
        timestamp: new Date(data.timestamp)
      };

      setMessages(prev => [...prev, agentMessage]);
      
      // Track token usage
      if (data.tokensUsed) {
        setTotalTokens(prev => prev + data.tokensUsed!);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'agent',
        content: 'I apologize, but I encountered a technical issue. Please refresh the page and try again, or contact our team directly if the problem persists.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-12'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {sidebarOpen && (
            <div className="flex gap-2">
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="AI Settings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={createNewChat}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                New Chat
              </button>
            </div>
          )}
        </div>

        {/* Chat Sessions */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-2 px-2">
                Chats ({chatSessions.length})
              </div>
              {chatSessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`p-2 mb-1 rounded-lg cursor-pointer transition-colors group ${
                    index === currentSessionIndex
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => switchToSession(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {session.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.messages.length} messages
                      </div>
                    </div>
                    {chatSessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(index);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Token Usage */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total tokens:</span>
                  <span className="font-mono">{totalTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. cost:</span>
                  <span className="font-mono">${(totalTokens * 0.00003).toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full border border-gray-300 rounded-lg overflow-hidden bg-white m-4">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 text-center">
            <h2 className="text-xl font-semibold">ELLU Studios AI Concierge</h2>
            <p className="text-sm text-gray-300 mt-1">Your guide to fashion education</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="text-sm">
                    {formatMessage(message.content)}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-900 max-w-[80%] p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">Thinking...</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
              {error}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about ELLU Studios courses..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Ask about courses, learning journeys, scheduling, or anything about ELLU Studios
            </div>
          </form>
        </div>
      </div>

      {/* LLM Settings Modal */}
      <LLMSettingsPanel
        settings={llmSettings}
        onSettingsChange={setLLMSettings}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}