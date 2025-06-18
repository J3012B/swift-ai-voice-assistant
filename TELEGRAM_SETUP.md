# Telegram API Service Setup

This service allows you to send messages from a Telegram bot to specific users or chats.

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather
3. Send `/newbot` command
4. Follow the prompts to create your bot:
   - Choose a name for your bot (e.g., "My Assistant Bot")
   - Choose a username ending in "bot" (e.g., "myassistant_bot")
5. BotFather will provide you with a bot token that looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Configure Environment Variables

Add your bot token to your environment variables:

```bash
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_ADMIN_USER_ID=your_admin_user_chat_id_here
```

### 3. Find User Chat IDs

To send messages to specific users, you need their chat ID:

1. Have the target user start a conversation with your bot by sending any message
2. Use the API endpoint to get recent updates:
   ```bash
   GET /api/telegram/chat?limit=10
   ```
3. Find the user's chat ID in the response

## API Endpoints

### Send Message
`POST /api/telegram/send`

Send a message to a specific chat or user.

**Request Body:**
```json
{
  "chatId": "123456789", // or number
  "message": "Hello from the bot!",
  "parseMode": "HTML", // optional: "HTML", "Markdown", "MarkdownV2"
  "disableWebPagePreview": true, // optional
  "disableNotification": false, // optional
  "replyToMessageId": 123 // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Get Bot Info
`GET /api/telegram/send`

Test bot connectivity and get bot information.

**Response:**
```json
{
  "success": true,
  "bot": {
    "id": 123456789,
    "name": "My Assistant Bot",
    "username": "myassistant_bot",
    "isBot": true
  }
}
```

### Get Chat Info
`POST /api/telegram/chat`

Get information about a specific chat.

**Request Body:**
```json
{
  "chatId": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "chat": {
    "id": 123456789,
    "type": "private",
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "bio": null
  }
}
```

### Get Recent Updates
`GET /api/telegram/chat?offset=0&limit=10`

Get recent messages sent to the bot (useful for finding chat IDs).

**Response:**
```json
{
  "success": true,
  "updates": [
    {
      "update_id": 123456,
      "message": {
        "message_id": 789,
        "from": {
          "id": 987654321,
          "first_name": "John",
          "username": "johndoe"
        },
        "chat": {
          "id": 987654321,
          "type": "private"
        },
        "date": 1234567890,
        "text": "Hello bot!"
      }
    }
  ]
}
```

## Usage Examples

### Using the Service Directly

```typescript
import { telegramService } from '../lib/telegram-service';

// Send a simple text message
await telegramService.sendTextMessage(123456789, "Hello from the app!");

// Send an HTML formatted message
await telegramService.sendHtmlMessage(
  123456789, 
  "<b>Bold text</b> and <i>italic text</i>"
);

// Send a Markdown message
await telegramService.sendMarkdownMessage(
  123456789, 
  "*Bold text* and _italic text_"
);

// Get bot information
const botInfo = await telegramService.getBotInfo();
console.log(botInfo);

// Get chat information
const chatInfo = await telegramService.getChat(123456789);
console.log(chatInfo);
```

### Using the API Endpoints

```javascript
// Send a message via API
const response = await fetch('/api/telegram/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chatId: '123456789',
    message: 'Hello from the web app!',
    parseMode: 'HTML'
  })
});

const result = await response.json();
console.log(result);
```

## Security Notes

- Keep your bot token secure and never expose it in client-side code
- Store the bot token in environment variables
- Consider implementing authentication for your API endpoints in production
- Validate chat IDs to ensure messages are only sent to authorized recipients

## Error Notifications

The system now automatically sends error notifications to the admin user when OpenAI or Cartesia API calls fail.

### Setup Error Notifications

1. **Set Admin User ID**: Add your personal Telegram chat ID to the environment variables:
   ```bash
   TELEGRAM_ADMIN_USER_ID=123456789
   ```

2. **Find Your Chat ID**: Send a message to your bot, then call the updates endpoint:
   ```bash
   curl -X GET "http://localhost:3000/api/telegram/chat?limit=1"
   ```
   Your chat ID will be in the response under `updates[0].message.from.id`.

3. **Test Notifications**: The system will automatically send notifications when:
   - OpenAI transcription fails
   - OpenAI chat completion fails
   - Cartesia voice synthesis fails
   - Network connectivity issues occur

### Error Notification Format

You'll receive formatted messages like:

```
🤖 OpenAI API Error

❌ Error: Chat completion failed
🆔 Request ID: abc123
⏰ Time: 2024-01-15 14:30:25 UTC

📋 Details:
Error: Request timeout after 30 seconds
```

## Troubleshooting

### Common Issues

1. **"Unauthorized" error**: Check that your bot token is correct
2. **"Chat not found"**: Make sure the user has started a conversation with your bot
3. **"Bot was blocked by the user"**: The user has blocked your bot
4. **"Invalid chat_id"**: Double-check the chat ID format and value

### Testing Your Setup

1. Test bot connectivity:
   ```bash
   curl -X GET http://localhost:3000/api/telegram/send
   ```

2. Send a test message to yourself:
   ```bash
   curl -X POST http://localhost:3000/api/telegram/send \
     -H "Content-Type: application/json" \
     -d '{"chatId":"YOUR_CHAT_ID","message":"Test message"}'
   ``` 