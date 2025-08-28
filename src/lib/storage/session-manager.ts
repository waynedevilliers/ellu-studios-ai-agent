// Session Management with Local Storage Persistence
// Handles chat session persistence across browser sessions

interface StoredSession {
  id: string;
  name: string;
  messages: Array<{
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: string;
  }>;
  lastActivity: string;
  tokensUsed: number;
}

export class SessionManager {
  private static STORAGE_KEY = 'ellu-chat-sessions';
  
  static saveSessions(sessions: any[]): void {
    try {
      const storedSessions: StoredSession[] = sessions.map(session => ({
        id: session.id,
        name: session.name,
        messages: session.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        lastActivity: session.lastActivity.toISOString(),
        tokensUsed: session.tokensUsed || 0
      }));
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedSessions));
    } catch (error) {
      console.warn('Failed to save sessions to localStorage:', error);
    }
  }
  
  static loadSessions(): any[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const storedSessions: StoredSession[] = JSON.parse(stored);
      return storedSessions.map(session => ({
        id: session.id,
        name: session.name,
        messages: session.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        })),
        lastActivity: new Date(session.lastActivity),
        tokensUsed: session.tokensUsed || 0
      }));
    } catch (error) {
      console.warn('Failed to load sessions from localStorage:', error);
      return [];
    }
  }
  
  static clearSessions(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear sessions:', error);
    }
  }
}