/**
 * useChat.js
 * React hook that manages chat state and connects to POST /api/chat.
 *
 * - No mock responses — all AI replies come from the real backend.
 * - Aborts in-flight requests if a new message is sent.
 * - Exposes: messages, isTyping, error, sendMessage, clearError, clearHistory
 */
import { useState, useCallback, useRef } from 'react';
import { sendChatMessage, humaniseError } from '../services/chatService';

const WELCOME = {
    id: 0,
    type: 'ai',
    text: "Hey! 👋 I'm your personal event assistant. Tell me what you're looking for — genre, location, budget, vibe — and I'll find the perfect events for you.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    recommendations: [],
};

let _nextId = 1;
const nextId = () => _nextId++;

export const useChat = (user) => {
    const [messages, setMessages] = useState([WELCOME]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    // Keep a ref to cancel the previous request
    const abortRef = useRef(null);

    const clearError = useCallback(() => setError(null), []);
    const clearHistory = useCallback(() => {
        setMessages([WELCOME]);
        setError(null);
    }, []);

    const sendMessage = useCallback(async (text) => {
        const trimmed = text?.trim();
        if (!trimmed || isTyping) return;

        // Cancel any previous in-flight request
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        // Append user message immediately
        const userMsg = {
            id: nextId(),
            type: 'user',
            text: trimmed,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendations: [],
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        setError(null);

        const userId = user?.id || 'demo-user-123';

        try {
            const data = await sendChatMessage(userId, trimmed, abortRef.current.signal);

            const aiMsg = {
                id: nextId(),
                type: 'ai',
                text: data.message ?? 'Here are some events I found for you!',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (err) {
            // Ignore intentional cancels (from rapid new messages)
            if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;

            const msg = humaniseError(err);
            setError(msg);

            // Add a visible error bubble in the conversation
            setMessages(prev => [...prev, {
                id: nextId(),
                type: 'error',
                text: msg,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                recommendations: [],
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [user, isTyping]);

    return { messages, isTyping, error, sendMessage, clearError, clearHistory };
};
