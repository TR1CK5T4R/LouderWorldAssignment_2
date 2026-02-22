/**
 * useSocket.js
 * Manages a Socket.io connection tied to the authenticated user.
 *
 * - Connects with `?userId=<id>` so the backend can route events to this socket
 * - Automatically reconnects using Socket.io's built-in exponential back-off
 * - Disconnects cleanly on unmount or when userId changes
 * - Returns the socket instance for event binding
 *
 * StrictMode note:
 *   React 18 StrictMode double-invokes effects (mount → unmount → remount).
 *   We use `autoConnect: false` and connect manually via a microtask so that
 *   if StrictMode unmounts us before the microtask runs we never start the
 *   WebSocket handshake — eliminating the "WebSocket closed before connection
 *   was established" console error entirely.
 */
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Connect directly to the backend in dev — bypasses Vite's WS proxy which
// causes EPIPE errors every time the backend restarts with node --watch.
// In production, set VITE_SOCKET_URL to your backend URL (e.g. https://api.yourdomain.com).
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000';

/**
 * @param {string|null} userId   - The authenticated user's ID
 * @param {boolean}     enabled  - Only connect when true (i.e. user is authenticated)
 * @param {(socket: import('socket.io-client').Socket) => (() => void)} onConnected
 *   - Callback invoked once the socket is ready. Return a cleanup function to
 *     remove event listeners. Called again after every reconnect.
 */
const useSocket = (userId, enabled, onConnected) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!enabled || !userId) return;

        // Create socket but don't connect yet — this avoids opening the
        // WebSocket during StrictMode's first (throwaway) mount cycle.
        const socket = io(SOCKET_URL, {
            query: { userId },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10_000,
            autoConnect: false,   // ← key: don't open WS until we call connect()
        });

        socketRef.current = socket;

        let cleanupListeners = null;
        let alive = true; // set to false by cleanup so the microtask can bail out

        socket.on('connect', () => {
            console.log(`[socket] Connected as ${userId} (id=${socket.id})`);
            if (cleanupListeners) cleanupListeners();
            cleanupListeners = onConnected(socket) ?? null;
        });

        socket.on('connect_error', (err) => {
            console.warn(`[socket] Connection error: ${err.message}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`[socket] Disconnected: ${reason}`);
        });

        // Connect asynchronously so StrictMode's synchronous unmount runs first.
        // If cleanup has already run by the time this executes, `alive` is false
        // and we skip connect entirely — no WebSocket is ever opened.
        Promise.resolve().then(() => {
            if (alive) socket.connect();
        });

        return () => {
            alive = false;
            cleanupListeners?.();
            // socket.disconnect() is safe to call even if connect() was never
            // called — it's a no-op on a disconnected socket.
            socket.disconnect();
            socketRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, enabled]);

    return socketRef;
};

export default useSocket;
