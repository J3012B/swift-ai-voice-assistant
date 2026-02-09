import { telegramService } from './telegram-service';

interface ErrorNotificationData {
  service: 'OpenAI' | 'Cartesia' | 'System';
  error: string;
  details?: any;
  requestId?: string;
  timestamp?: Date;
  userAgent?: string;
}

class TelegramErrorNotifier {
  private get adminUserId(): string | null {
    return process.env.TELEGRAM_ADMIN_USER_ID || null;
  }

  private get enabled(): boolean {
    return Boolean(this.adminUserId && process.env.TELEGRAM_ADMIN_BOT_TOKEN);
  }

  /**
   * Send error notification to admin user
   */
  async notifyError(data: ErrorNotificationData): Promise<boolean> {
    if (!this.enabled || !this.adminUserId) {
      return false;
    }

    try {
      const timestamp = data.timestamp || new Date();
      const requestId = data.requestId || 'unknown';
      
      const errorMessage = this.formatErrorMessage(data, timestamp, requestId);
      
      const success = await telegramService.sendHtmlMessage(
        this.adminUserId,
        errorMessage
      );

      if (success) {
        console.log(`✅ Error notification sent to admin for ${data.service} error`);
      } else {
        console.error(`❌ Failed to send error notification for ${data.service} error`);
      }

      return success;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }

  /**
   * Format error message for Telegram
   */
  private formatErrorMessage(data: ErrorNotificationData, timestamp: Date, requestId: string): string {
    const serviceEmoji = {
      'OpenAI': '🤖',
      'Cartesia': '🎵',
      'System': '⚙️'
    };

    const timeString = timestamp.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    let message = `
${serviceEmoji[data.service]} <b>${data.service} API Error</b>

❌ <b>Error:</b> ${this.escapeHtml(data.error)}

🆔 <b>Request ID:</b> <code>${requestId}</code>
⏰ <b>Time:</b> ${timeString} UTC
    `.trim();

    // Add details if available
    if (data.details) {
      const detailsStr = typeof data.details === 'string' 
        ? data.details 
        : JSON.stringify(data.details, null, 2);
      
      message += `\n\n📋 <b>Details:</b>\n<code>${this.escapeHtml(detailsStr)}</code>`;
    }

    // Add user agent if available
    if (data.userAgent) {
      message += `\n\n🌐 <b>User Agent:</b> <code>${this.escapeHtml(data.userAgent)}</code>`;
    }

    return message;
  }

  /**
   * Escape HTML characters for Telegram
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Send OpenAI error notification
   */
  async notifyOpenAIError(error: string, details?: any, requestId?: string): Promise<boolean> {
    return this.notifyError({
      service: 'OpenAI',
      error,
      details,
      requestId,
      timestamp: new Date()
    });
  }

  /**
   * Send Cartesia error notification
   */
  async notifyCartesiaError(error: string, details?: any, requestId?: string): Promise<boolean> {
    return this.notifyError({
      service: 'Cartesia',
      error,
      details,
      requestId,
      timestamp: new Date()
    });
  }

  /**
   * Send system error notification
   */
  async notifySystemError(error: string, details?: any, requestId?: string): Promise<boolean> {
    return this.notifyError({
      service: 'System',
      error,
      details,
      requestId,
      timestamp: new Date()
    });
  }

  /**
   * Send user signup notification to admin
   */
  async notifyUserSignup(email: string, signupMethod: 'email' | 'google' = 'email'): Promise<boolean> {
    if (!this.enabled || !this.adminUserId) {
      return false;
    }

    try {
      const timestamp = new Date();
      const timeString = timestamp.toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const methodEmoji = signupMethod === 'google' ? '🔗' : '📧';
      const methodText = signupMethod === 'google' ? 'Google OAuth' : 'Email/Password';

      const message = `
🎉 <b>New User Signup!</b>

👤 <b>Email:</b> ${this.escapeHtml(email)}
${methodEmoji} <b>Method:</b> ${methodText}
⏰ <b>Time:</b> ${timeString} UTC
      `.trim();

      const success = await telegramService.sendHtmlMessage(
        this.adminUserId,
        message
      );

      if (success) {
        console.log(`✅ Signup notification sent to admin for user: ${email}`);
      } else {
        console.error(`❌ Failed to send signup notification for user: ${email}`);
      }

      return success;
    } catch (error) {
      console.error('Error sending signup notification:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const telegramErrorNotifier = new TelegramErrorNotifier();

// Export class for custom instances
export { TelegramErrorNotifier };

// Export types
export type { ErrorNotificationData }; 