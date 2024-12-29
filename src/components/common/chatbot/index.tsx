import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react';
import { MessageCircle, X, Loader } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { generateResponse } from '../../../services/ChatService';

interface ChatState {
  messages: ChatMessageType[];
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: ChatMessageType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], error: null };
    default:
      return state;
  }
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null
};

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch] = useReducer(chatReducer, initialState);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
  
    const scrollToBottom = useCallback(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, []);
  
    useEffect(() => {
      scrollToBottom();
    }, [state.messages, scrollToBottom]);

  useEffect(() => {
    const handleResize = () => {
      if (chatContainerRef.current) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  }, [isOpen]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await generateResponse(content);
      const botMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to send message. Please try again.' 
      });
      console.error('Error sending message:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const unreadCount = state.messages.filter(m => !m.isUser).length;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        <div
            className={`mb-4 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isOpen}
        >
            <div
            ref={chatContainerRef}
            className="h-[500px] w-[350px] rounded-lg bg-white shadow-xl"
            role="dialog"
            aria-label="Chat window"
            >
            <div className="flex h-14 items-center justify-between rounded-t-lg bg-blue-600 px-4 text-white">
                <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Ask Zenith AI</h3>
                </div>
                <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close chat"
                >
                <X className="h-5 w-5" />
                </button>
            </div>
            <div
                className="h-[calc(100%-8rem)] overflow-y-auto p-4"
                role="log"
                aria-live="polite"
            >
                {state.messages.length === 0 && (
                <div className="flex h-full items-center justify-center text-gray-500">
                    <p>How can I help you today?</p>
                </div>
                )}
                {state.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
                ))}
                {state.isLoading && (
                <div className="flex justify-start">
                    <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-3">
                    <Loader className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                </div>
                )}
                {state.error && (
                <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
                    {state.error}
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="absolute bottom-0 w-full border-t bg-white p-4">
                <ChatInput
                onSend={handleSendMessage}
                disabled={state.isLoading}
                placeholder="Type your message..."
                />
            </div>
            </div>
        </div>
        <button
            onClick={() => setIsOpen(prev => !prev)}
            className={`group relative rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
            isOpen ? 'rotate-180 transform' : ''
            }`}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
            aria-expanded={isOpen}
        >
            <MessageCircle className="h-6 w-6" />
            {!isOpen && state.messages.filter(m => !m.isUser).length > 0 && (
            <span
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold"
                aria-label={`${state.messages.filter(m => !m.isUser).length} unread messages`}
            >
                {state.messages.filter(m => !m.isUser).length}
            </span>
            )}
        </button>
        </div>
    );
    };

    export default Chatbot;