
import React, { useState, useRef, useEffect } from 'react';
import { MessageType, AssistantMessage, MessageStep } from '../types';
import EmptyState from './EmptyState';
import Message from './Message';

interface InspectionViewProps {
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
    isAnalyzing: boolean;
    setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
}

const InspectionView: React.FC<InspectionViewProps> = ({ messages, setMessages, isAnalyzing, setIsAnalyzing }) => {
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const startInspection = (query: string) => {
        const userMessage = { role: 'user' as const, content: query };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsAnalyzing(true);

        setTimeout(() => {
            const assistantMessage: AssistantMessage = {
                role: 'assistant',
                steps: []
            };
            setMessages(prev => [...prev, assistantMessage]);
            
            const steps: { type: MessageStep, delay: number }[] = [
                { type: 'step1', delay: 500 },
                { type: 'step2', delay: 1500 },
                { type: 'step3', delay: 2800 },
                { type: 'step4', delay: 3500 },
                { type: 'step5', delay: 4200 },
                { type: 'report', delay: 5000 }
            ];

            steps.forEach(({ type, delay }) => {
                setTimeout(() => {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'assistant') {
                            lastMsg.steps = [...lastMsg.steps, type];
                        }
                        return newMessages;
                    });
                    
                    if (type === 'report') {
                        setIsAnalyzing(false);
                    }
                }, delay);
            });
        }, 200);
    };

    const handleSend = () => {
        if (inputValue.trim() && !isAnalyzing) {
            startInspection(inputValue);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-6" ref={chatContainerRef}>
                <div className="max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                        <EmptyState onQuickAction={startInspection} />
                    ) : (
                        messages.map((msg, index) => (
                            <Message key={index} message={msg} />
                        ))
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-white">
                <div className="max-w-4xl mx-auto">
                     <div className="flex gap-2 mb-3 flex-wrap">
                        <button 
                            onClick={() => startInspection('Inspect the health of core business APIs')}
                            disabled={isAnalyzing}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            🔍 Inspect Core APIs
                        </button>
                     </div>
                    <div className="flex gap-4 items-end">
                        <textarea
                            className="flex-1 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent outline-none"
                            placeholder="Describe what you want to inspect..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            rows={1}
                            style={{minHeight: '44px', maxHeight: '150px'}}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isAnalyzing}
                            className="px-6 py-2.5 bg-[#667eea] text-white rounded-lg font-semibold text-sm hover:bg-[#5a67d8] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionView;
