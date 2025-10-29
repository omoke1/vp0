import { environment } from '../config/environment';

export interface WalletSession {
  address: string;
  chainId: number;
  ensName?: string;
  connectedAt: number;
  lastActivity: number;
  connectionMethod: 'injected' | 'walletconnect' | 'coinbase' | 'unknown';
  preferences: {
    autoConnect: boolean;
    rememberChain: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface SessionStats {
  totalConnections: number;
  averageSessionDuration: number;
  mostUsedChain: number;
  connectionMethods: Record<string, number>;
  lastConnected: number;
}

class SessionManager {
  private readonly STORAGE_KEY = 'vpo_wallet_session';
  private readonly STATS_KEY = 'vpo_session_stats';
  private readonly MAX_SESSION_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly MAX_STATS_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

  /**
   * Save wallet session to localStorage
   */
  saveSession(session: WalletSession): void {
    try {
      const sessionData = {
        ...session,
        lastActivity: Date.now(),
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      this.updateStats(session);
      
      console.log('Wallet session saved:', session.address);
    } catch (error) {
      console.error('Failed to save wallet session:', error);
    }
  }

  /**
   * Load wallet session from localStorage
   */
  loadSession(): WalletSession | null {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEY);
      if (!sessionData) return null;

      const session: WalletSession = JSON.parse(sessionData);
      
      // Check if session is still valid
      if (this.isSessionValid(session)) {
        // Update last activity
        session.lastActivity = Date.now();
        this.saveSession(session);
        return session;
      } else {
        // Session expired, remove it
        this.clearSession();
        return null;
      }
    } catch (error) {
      console.error('Failed to load wallet session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Clear wallet session from localStorage
   */
  clearSession(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Wallet session cleared');
    } catch (error) {
      console.error('Failed to clear wallet session:', error);
    }
  }

  /**
   * Update session activity timestamp
   */
  updateActivity(address: string): void {
    try {
      const session = this.loadSession();
      if (session && session.address === address) {
        session.lastActivity = Date.now();
        this.saveSession(session);
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  /**
   * Check if session is valid (not expired)
   */
  private isSessionValid(session: WalletSession): boolean {
    const now = Date.now();
    const sessionAge = now - session.connectedAt;
    const lastActivityAge = now - session.lastActivity;
    
    // Session is valid if it's not too old and user was active recently
    return sessionAge < this.MAX_SESSION_AGE && lastActivityAge < 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Update session statistics
   */
  private updateStats(session: WalletSession): void {
    try {
      const statsData = localStorage.getItem(this.STATS_KEY);
      let stats: SessionStats = statsData ? JSON.parse(statsData) : {
        totalConnections: 0,
        averageSessionDuration: 0,
        mostUsedChain: 1,
        connectionMethods: {},
        lastConnected: 0,
      };

      // Update stats
      stats.totalConnections++;
      stats.lastConnected = Date.now();
      
      // Update chain usage
      if (stats.mostUsedChain === session.chainId) {
        // Already the most used chain
      } else {
        // Simple heuristic - could be improved with more sophisticated tracking
        stats.mostUsedChain = session.chainId;
      }
      
      // Update connection methods
      stats.connectionMethods[session.connectionMethod] = 
        (stats.connectionMethods[session.connectionMethod] || 0) + 1;

      // Update average session duration (simplified calculation)
      const currentSessionDuration = Date.now() - session.connectedAt;
      stats.averageSessionDuration = 
        (stats.averageSessionDuration + currentSessionDuration) / 2;

      // Clean up old stats
      if (Date.now() - stats.lastConnected > this.MAX_STATS_AGE) {
        stats = {
          totalConnections: 1,
          averageSessionDuration: currentSessionDuration,
          mostUsedChain: session.chainId,
          connectionMethods: { [session.connectionMethod]: 1 },
          lastConnected: Date.now(),
        };
      }

      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to update session stats:', error);
    }
  }

  /**
   * Get session statistics
   */
  getStats(): SessionStats | null {
    try {
      const statsData = localStorage.getItem(this.STATS_KEY);
      if (!statsData) return null;

      const stats: SessionStats = JSON.parse(statsData);
      
      // Check if stats are still valid
      if (Date.now() - stats.lastConnected > this.MAX_STATS_AGE) {
        this.clearStats();
        return null;
      }

      return stats;
    } catch (error) {
      console.error('Failed to get session stats:', error);
      return null;
    }
  }

  /**
   * Clear session statistics
   */
  clearStats(): void {
    try {
      localStorage.removeItem(this.STATS_KEY);
      console.log('Session stats cleared');
    } catch (error) {
      console.error('Failed to clear session stats:', error);
    }
  }

  /**
   * Get user preferences
   */
  getPreferences(): WalletSession['preferences'] {
    const session = this.loadSession();
    return session?.preferences || {
      autoConnect: true,
      rememberChain: true,
      theme: 'auto',
    };
  }

  /**
   * Update user preferences
   */
  updatePreferences(preferences: Partial<WalletSession['preferences']>): void {
    const session = this.loadSession();
    if (session) {
      session.preferences = { ...session.preferences, ...preferences };
      this.saveSession(session);
    } else {
      // Create a minimal session with preferences
      const newSession: WalletSession = {
        address: '',
        chainId: 1,
        connectedAt: Date.now(),
        lastActivity: Date.now(),
        connectionMethod: 'unknown',
        preferences: {
          autoConnect: true,
          rememberChain: true,
          theme: 'auto',
          ...preferences,
        },
      };
      this.saveSession(newSession);
    }
  }

  /**
   * Check if auto-connect is enabled
   */
  shouldAutoConnect(): boolean {
    const preferences = this.getPreferences();
    return preferences.autoConnect && this.loadSession() !== null;
  }

  /**
   * Get the preferred chain for auto-connect
   */
  getPreferredChain(): number {
    const session = this.loadSession();
    const preferences = this.getPreferences();
    
    if (preferences.rememberChain && session) {
      return session.chainId;
    }
    
    return environment.blockchain.defaultChain;
  }

  /**
   * Export session data for backup
   */
  exportSessionData(): string {
    try {
      const session = this.loadSession();
      const stats = this.getStats();
      
      return JSON.stringify({
        session,
        stats,
        exportedAt: Date.now(),
        version: '1.0.0',
      }, null, 2);
    } catch (error) {
      console.error('Failed to export session data:', error);
      throw error;
    }
  }

  /**
   * Import session data from backup
   */
  importSessionData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.session) {
        this.saveSession(parsed.session);
      }
      
      if (parsed.stats) {
        localStorage.setItem(this.STATS_KEY, JSON.stringify(parsed.stats));
      }
      
      console.log('Session data imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import session data:', error);
      return false;
    }
  }

  /**
   * Clean up expired data
   */
  cleanup(): void {
    try {
      const session = this.loadSession();
      if (!session) {
        // No valid session, clean up stats if they're old
        const stats = this.getStats();
        if (!stats) {
          this.clearStats();
        }
      }
    } catch (error) {
      console.error('Failed to cleanup session data:', error);
    }
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  sessionManager.cleanup();
}

export default SessionManager;
