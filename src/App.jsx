import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { useChat } from './hooks/useChat';
import { getNotifications, markAsRead } from './services/notificationService';

/* ────────────────────────────────────────────────────────────
   Login Page
────────────────────────────────────────────────────────────── */
function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) setError(result.error || 'Login failed.');
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]
                          flex items-center justify-center text-2xl shadow-lg shadow-[var(--color-primary)]/20">
            🎵
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">
            Louder<span className="text-[var(--color-primary)]">World</span>
          </h1>
        </div>

        <p className="text-center text-[var(--color-text-muted)] text-sm mb-8 font-medium">
          Your AI-powered event discovery assistant
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Email</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)]
                         text-[14px] text-[var(--color-text-main)] outline-none transition-all
                         focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Password</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)]
                         text-[14px] text-[var(--color-text-main)] outline-none transition-all
                         focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]
                       text-white font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5
                       disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          {error && (
            <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-xs font-medium text-[var(--color-text-muted)]">
          Enter any email + password to explore in demo mode.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Event Card
────────────────────────────────────────────────────────────── */
const EventCard = memo(function EventCard({ id, image, title, date, venue, ticketUrl }) {
  const CardWrapper = ticketUrl ? 'a' : 'div';
  const wrapperProps = ticketUrl ? { href: ticketUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="card-container group flex flex-col sm:flex-row shadow-subtle hover:shadow-card bg-[var(--color-bg-panel)] overflow-hidden border border-[var(--color-border)] rounded-2xl cursor-pointer"
    >
      <CardWrapper {...wrapperProps} className="flex flex-col sm:flex-row w-full no-underline text-inherit font-inherit hover:text-inherit">
        {/* Image Area - Left on Desktop, Top on Mobile */}
        {image && (
          <div className="sm:w-[140px] h-[160px] sm:h-auto shrink-0 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
            <img
              src={image}
              alt={title || 'Event image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Details Area - Right on Desktop, Bottom on Mobile */}
        <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
          <h3 className="text-[15px] font-bold text-[var(--color-text-main)] leading-tight line-clamp-2">
            {title || 'Untitled Event'}
          </h3>

          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-start gap-2 text-[13px] font-medium text-[var(--color-text-muted)]">
              <span className="text-[14px] shrink-0 translate-y-[1px]">📅</span>
              <span className="break-words line-clamp-1">{date || 'Date TBA'}</span>
            </div>
            <div className="flex items-start gap-2 text-[13px] font-medium text-[var(--color-text-muted)]">
              <span className="text-[14px] shrink-0 translate-y-[1px]">📍</span>
              <span className="break-words line-clamp-1">{venue || 'Venue TBA'}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-end">
            <button className="card-btn group-hover:bg-gradient-to-r group-hover:from-[var(--color-accent)] group-hover:to-[var(--color-accent-light)] whitespace-nowrap">
              Get Tickets
            </button>
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
});

/* ────────────────────────────────────────────────────────────
   Typing Indicator
────────────────────────────────────────────────────────────── */
const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="chat-bubble-row">
      <div className="avatar-base avatar-ai self-end pb-1">🤖</div>
      <div className="flex flex-col max-w-[calc(100%-48px)]">
        <div className="chat-bubble chat-bubble-ai flex items-center gap-1.5 py-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse [animation-delay:0.2s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
});

/* ────────────────────────────────────────────────────────────
   Message Bubble
────────────────────────────────────────────────────────────── */
const MessageBubble = memo(function MessageBubble({ message, role, timestamp, events }) {
  const isUser = role === 'user';

  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="font-semibold text-[var(--color-primary-dark)]">{p.slice(2, -2)}</strong>
        : p
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex flex-col gap-1.5 w-full max-w-[850px] ${isUser ? 'items-end self-end' : 'items-start self-start'}`}
    >
      <div
        className={`px-4 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-subtle break-words ${isUser
          ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white rounded-br-sm shadow-card'
          : 'bg-[var(--color-bg-panel)] border border-[var(--color-border)] text-[var(--color-text-main)] rounded-bl-sm border-l-4 border-l-[var(--color-accent)]'
          }`}
      >
        {renderText(message)}
      </div>

      {!isUser && events?.length > 0 && (
        <div className="flex flex-col gap-3 mt-3 w-full">
          {events.map((ev) => {
            // Map backend fields to our strict UI props.
            // If the backend doesn't send an image, use a placeholder or leave undefined.
            const dateStr = ev.date
              ? new Date(ev.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
              : null;

            return (
              <EventCard
                key={ev._id || ev.id || ev.title}
                id={ev._id || ev.id}
                image={ev.image || 'https://images.unsplash.com/photo-1540039155732-684736dd633f?auto=format&fit=crop&q=80&w=400'} // Default fallback if no image provided
                title={ev.title}
                date={dateStr}
                venue={ev.location || ev.venue}
                ticketUrl={ev.sourceUrl || ev.ticketUrl}
              />
            );
          })}
        </div>
      )}

      {timestamp && (
        <span className="text-[11px] font-medium text-[var(--color-text-muted)] px-1">
          {timestamp}
        </span>
      )}
    </motion.div>
  );
});

/* ────────────────────────────────────────────────────────────
   Sidebar
────────────────────────────────────────────────────────────── */
const SUGGESTED = [
  { id: 1, icon: '🎸', label: 'Rock night in Sydney' },
  { id: 2, icon: '🎹', label: 'Jazz events this weekend' },
  { id: 3, icon: '🎉', label: 'Family-friendly festivals' },
  { id: 4, icon: '🎤', label: 'Live music under $50' },
];

const Sidebar = memo(function Sidebar({ user, onNewChat, onSelectSuggestion, onClose }) {
  const { logout } = useAuth();
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <aside className="sidebar-container h-full">
      <div className="flex items-center gap-3 p-5 border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]
                        flex items-center justify-center text-lg shadow-md shadow-[var(--color-primary)]/20 text-white shrink-0">
          🎵
        </div>
        <h1 className="text-[16px] font-bold tracking-tight text-[var(--color-text-main)] truncate">
          Louder<span className="text-[var(--color-primary)]">World</span>
        </h1>
      </div>

      <div className="p-4">
        <button className="sidebar-btn" onClick={onNewChat}>
          <span className="text-lg leading-none mb-0.5">＋</span> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-styled px-3">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] px-3 mb-2">
          Quick Starts
        </div>
        <div className="flex flex-col gap-0.5">
          {SUGGESTED.map(s => (
            <div key={s.id} className="sidebar-item" onClick={() => { onSelectSuggestion(s.label); onClose?.(); }}>
              <span className="text-base shrink-0">{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--color-bg-base)]">
          <div className="avatar-base bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[var(--color-text-main)] truncate">{user?.name || 'Guest'}</div>
            <div className="text-[11px] font-medium text-[var(--color-text-muted)] truncate">{user?.email || ''}</div>
          </div>
          <button
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
            onClick={logout} title="Sign out"
          >
            ←
          </button>
        </div>
      </div>
    </aside>
  );
});

/* ────────────────────────────────────────────────────────────
   Notification Bell
────────────────────────────────────────────────────────────── */
function NotificationBell({ notifications = [], unreadCount = 0, onMarkRead }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-[var(--color-bg-base)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl leading-none">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-80 bg-[var(--color-bg-panel)] rounded-2xl shadow-card border border-[var(--color-border)] overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-base)]/50">
            <h3 className="font-bold text-[14px] text-[var(--color-text-main)]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="text-[12px] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                onClick={() => {
                  onMarkRead();
                  setIsOpen(false);
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto scroll-styled">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-[var(--color-text-muted)]">
                You have no new notifications.
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif, idx) => (
                  <div
                    key={notif.id || idx}
                    className={`p-4 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-base)] transition-colors cursor-pointer ${notif.read ? 'opacity-70' : ''}`}
                    onClick={() => {
                      if (!notif.read && onMarkRead) onMarkRead(notif.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg mt-0.5 shrink-0">{notif.icon || '📌'}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[13px] text-[var(--color-text-main)] ${!notif.read ? 'font-semibold' : 'font-medium'}`}>
                          {notif.title}
                        </div>
                        {notif.message && (
                          <div className="text-[12px] text-[var(--color-text-muted)] mt-0.5 line-clamp-2">
                            {notif.message}
                          </div>
                        )}
                        <div className="text-[10px] text-[var(--color-text-muted)] mt-1.5 font-medium uppercase tracking-wide">
                          {notif.time || 'Just now'}
                        </div>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Preferences Panel
────────────────────────────────────────────────────────────── */
const PreferencesPanel = memo(function PreferencesPanel({ genres = [], budget = [], crowdType = [], preferredDates = [], onEdit }) {
  if (!genres.length && !budget.length && !crowdType.length && !preferredDates.length) return null;

  const renderSection = (title, items) => {
    if (!items || !items.length) return null;
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-muted)]">{title}</span>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-main)] shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[850px] mx-auto mb-6 p-4 rounded-xl bg-[var(--color-bg-panel)]/80 backdrop-blur-md border border-[var(--color-border)] shadow-subtle flex flex-col md:flex-row md:items-start justify-between gap-4"
    >
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderSection('Genres', genres)}
        {renderSection('Budget', budget)}
        {renderSection('Vibe', crowdType)}
        {renderSection('Dates', preferredDates)}
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 self-start md:self-center px-4 py-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white text-[12px] font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
      >
        Edit Profile
      </button>
    </motion.div>
  );
});

/* ────────────────────────────────────────────────────────────
   Chat Input Component
────────────────────────────────────────────────────────────── */
const ChatInput = memo(function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.focus();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-center">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="input-field scroll-styled"
          placeholder="Ask about events, genres, dates, budgets…"
          value={input}
          rows={1}
          onChange={e => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
          }}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <button
          className="input-send-btn flex items-center justify-center p-0"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
        >
          {disabled ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="text-center mt-3 text-[11px] font-medium text-[var(--color-text-muted)]">
        Press Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
});

/* ────────────────────────────────────────────────────────────
   Chat Page
────────────────────────────────────────────────────────────── */
const PROMPTS = [
  '🎸 Rock shows this weekend',
  '🎹 Jazz brunch in Sydney',
];

function ChatPage({ user }) {
  const { messages, isTyping, sendMessage, clearHistory } = useChat(user);
  const [sidebarOpen, setSidebar] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      // In a real app, you might poll this or use websockets.
      // For now, load on mount.
      const userId = user?.id || user?.email || 'demo-user-123';
      const initialNotes = await getNotifications(userId);
      setNotifications(initialNotes);
      setUnreadCount(initialNotes.filter(n => !n.read).length);
    }
    fetchNotifications();
  }, [user]);

  // Dummy state for preferences profile
  const [preferences, setPreferences] = useState({
    genres: ['Rock', 'Jazz'],
    budget: ['Under $50'],
    crowdType: ['Intimate', 'High Energy'],
    preferredDates: ['Weekends']
  });

  const bottomRef = useRef(null);
  const initial = (user?.name || user?.email || 'U')[0].toUpperCase();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = useCallback((text) => {
    if (!text || isTyping) return;
    sendMessage(text);
  }, [isTyping, sendMessage]);

  const hasOnlyWelcome = messages.length === 1;

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <header className="top-navbar">
        <button
          className="p-2 -ml-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-bg-base)] md:hidden mr-3"
          onClick={() => setSidebar(p => !p)}
        >
          ☰
        </button>
        <div className="flex-1">
          <div className="text-[15px] font-bold text-[var(--color-text-main)] leading-tight">LouderWorld AI</div>
          <div className="text-[12px] font-medium text-[var(--color-text-muted)]">Event assistant</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-bg-base)] border border-[var(--color-border)]">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-[var(--color-accent)] animate-pulse shadow-[0_0_8px_var(--color-accent)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mr-2 md:mr-0">
            {isTyping ? 'Thinking' : 'Online'}
          </span>
        </div>

        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={async (id) => {
            const userId = user?.id || user?.email || 'demo-user-123';
            const success = await markAsRead(id, userId);
            if (!success) return; // Optional logic: revert state if failed

            if (id) {
              setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
              setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              setUnreadCount(0);
            }
          }}
        />
      </header>

      {/* Body: Sidebar + Main Chat */}
      <div className="app-body">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10 md:hidden"
            onClick={() => setSidebar(false)} />
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 md:relative md:translate-x-0
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar
            user={user}
            onNewChat={() => { clearHistory(); setSidebar(false); }}
            onSelectSuggestion={(text) => send(text)}
            onClose={() => setSidebar(false)}
          />
        </div>

        {/* Main chat center */}
        <div className="chat-main-container">
          <div className="chat-messages-area scroll-styled">
            <div className="chat-center-content pt-4">

              <PreferencesPanel
                genres={preferences.genres}
                budget={preferences.budget}
                crowdType={preferences.crowdType}
                preferredDates={preferences.preferredDates}
                onEdit={() => alert('Edit preferences clicked! Callback triggered.')}
              />

              {useMemo(() => {
                if (hasOnlyWelcome) {
                  return (
                    <>
                      <MessageBubble
                        message={messages[0].text}
                        role={messages[0].type === 'error' ? 'ai' : messages[0].type}
                        timestamp={messages[0].timestamp}
                      />
                      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center max-w-lg mx-auto w-full">
                        <div className="text-5xl mb-4">🎶</div>
                        <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Ready to explore?</h2>
                        <p className="text-[15px] text-[var(--color-text-muted)] mb-8">
                          Tell me what you're looking for — genre, budget, location, or vibe.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {PROMPTS.map(p => (
                            <button key={p}
                              className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-panel)]
                                               text-[13px] font-medium text-[var(--color-text-muted)] transition-all
                                               hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-subtle hover:-translate-y-0.5"
                              onClick={() => send(p)}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }

                return messages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    message={msg.text}
                    role={msg.type === 'error' ? 'ai' : msg.type}
                    timestamp={msg.timestamp}
                    events={msg.recommendations}
                  />
                ));
              }, [messages, hasOnlyWelcome, send])}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} className="h-1" />
            </div>
          </div>

          <div className="chat-input-area">
            <ChatInput onSend={send} disabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Root App
────────────────────────────────────────────────────────────── */
export default function App() {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? <ChatPage user={user} /> : <LoginPage />;
}
