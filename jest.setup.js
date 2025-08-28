import '@testing-library/jest-dom'

// Polyfills for Node.js environment needed for LangChain
const { TextEncoder, TextDecoder } = require('util');
const { Readable } = require('stream');
const { ReadableStream } = require('stream/web');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
global.TransformStream = global.TransformStream || class {};

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';