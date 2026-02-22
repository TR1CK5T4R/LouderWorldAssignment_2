/**
 * chatService.js
 * Thin wrapper for POST /api/chat using the shared axiosInstance
 * (which automatically attaches the JWT Bearer header).
 */
import axiosInstance from './axiosInstance';
import axios from 'axios';

/**
 * @typedef {Object} ChatResponse
 * @property {string}   message         - AI-generated human-readable message
 * @property {Event[]}  recommendations - Matching event objects
 */

/**
 * @typedef {Object} Event
 * @property {string} _id
 * @property {string} title
 * @property {string} date
 * @property {string} location
 * @property {number} price
 * @property {string} sourceUrl
 */

/**
 * Send a chat message to the backend.
 * The JWT is attached automatically by the Axios request interceptor.
 *
 * Uses a 90-second timeout — HuggingFace free-tier models can take 30-60 s
 * on a cold start. The global axiosInstance timeout (25 s) is too short and
 * would fire ECONNABORTED before the backend even responds.
 *
 * @param {string} userId
 * @param {string} message
 * @param {AbortSignal} [signal]
 * @returns {Promise<ChatResponse>}
 */
export async function sendChatMessage(userId, message, signal) {
    const { data } = await axiosInstance.post(
        '/api/chat',
        { userId, message },
        {
            signal,
            // Override the instance-level timeout for this endpoint only.
            // Must be longer than CHAT_TIMEOUT_MS on the backend (120 000 ms).
            timeout: 130_000,
        }
    );
    return data;
}

/**
 * Map an Axios error into a user-friendly string.
 * @param {unknown} err
 * @returns {string}
 */
export function humaniseError(err) {
    if (axios.isCancel(err) || err?.name === 'CanceledError') {
        return 'Message cancelled.';
    }
    if (err?.code === 'ECONNABORTED') {
        // Axios timeout — the AI took too long to respond (HuggingFace cold start)
        return 'The AI is taking longer than usual. Please try again in a moment.';
    }
    if (err?.code === 'ERR_NETWORK') {
        return 'Network error — please check your connection and try again.';
    }
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.error || err?.response?.data?.message;

    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 429) return "You're sending messages too fast. Please wait a moment.";
    if (status === 400) return serverMsg || 'Invalid request. Please try again.';
    if (status === 503) return 'AI service is temporarily unavailable. Please try again shortly.';
    if (serverMsg) return serverMsg;
    return 'Something went wrong. Please try again.';
}
