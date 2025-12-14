import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Send, Volume2, VolumeX, Loader2, Square, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { useChat } from '../hooks/useChat';
import voiceService from '../services/voice.service';
import ReactMarkdown from 'react-markdown';

const EXAMPLE_PROMPTS = [
  'Summarize tickets from last 24 hours',
  'What are repeating issues over the weekend?',
  'Show me all SEV1 tickets',
  'Find frequent morning tickets from last week',
  'Who has the most assigned tickets?'
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');

    try {
      const response = await sendMessage(message);

      // Speak response if voice is enabled
      if (voiceEnabled && response && !response.isError) {
        setIsSpeaking(true);
        try {
          await voiceService.speak(response.content);
        } catch (err) {
          console.error('Voice error:', err);
        } finally {
          setIsSpeaking(false);
        }
      }
    } catch (err) {
      // Error already handled in useChat
    }
  };

  const handleExampleClick = (prompt) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      voiceService.stop();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleMicClick = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      if (!voiceService.isRecognitionSupported()) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      setIsListening(true);
      voiceService.startListening(
        (transcript) => {
          setInputValue(transcript);
          setIsListening(false);
          inputRef.current?.focus();
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);

          // Provide helpful error messages
          let errorMsg = 'Voice input error: ';
          if (error.message.includes('not-allowed')) {
            errorMsg += 'Microphone access denied. Please allow microphone permissions in your browser settings and try again.';
          } else if (error.message.includes('no-speech')) {
            errorMsg += 'No speech detected. Please try again.';
          } else {
            errorMsg += error.message;
          }
          alert(errorMsg);
        }
      );
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-6 right-6 w-80 shadow-xl border-2">
        <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">On-Call Assistant</span>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={() => setIsMinimized(false)}
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Minimize2 className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl border-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">On-Call Assistant</span>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={toggleVoice}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            title={isSpeaking ? 'Stop speaking' : voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
          >
            {isSpeaking ? (
              <Square className="h-4 w-4" />
            ) : voiceEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={() => setIsMinimized(true)}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center text-muted-foreground text-sm">
              <p className="mb-2">Ask me about your on-call tickets!</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Try asking:</p>
              {EXAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(prompt)}
                  className="w-full text-left text-xs p-2 rounded bg-muted hover:bg-muted/80 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : msg.isError
                      ? 'bg-destructive/10 text-destructive border border-destructive/20'
                      : 'bg-muted'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          code: ({ inline, children }) =>
                            inline ? (
                              <code className="bg-muted px-1 rounded text-xs">{children}</code>
                            ) : (
                              <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
                                {children}
                              </code>
                            ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask about tickets..."}
            disabled={isLoading || isListening}
            className="flex-1"
          />
          {voiceService.isRecognitionSupported() && (
            <Button
              onClick={handleMicClick}
              disabled={isLoading}
              size="icon"
              variant={isListening ? "default" : "ghost"}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
            </Button>
          )}
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}