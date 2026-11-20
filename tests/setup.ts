import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web SpeechSynthesis for tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([
        { name: 'Test Narrator', lang: 'en-US', default: true },
      ]),
      onvoiceschanged: null,
    },
    writable: true,
  });
}
