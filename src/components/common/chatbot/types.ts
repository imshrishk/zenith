export interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  }
  
  export interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
  }