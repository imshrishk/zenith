import React, { memo } from 'react';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = memo(({ message }) => {
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);

  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
      role="listitem"
    >
      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          message.isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <time
          dateTime={message.timestamp.toISOString()}
          className="mt-1 block text-xs opacity-75"
        >
          {formattedTime}
        </time>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';