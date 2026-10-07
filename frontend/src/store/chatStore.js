import { create } from 'zustand';
import { chatAPI, API_BASE } from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isStreaming: false,
  streamingContent: '',
  error: null,

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await chatAPI.getConversations();
      set({ conversations: res.data.data.conversations, isLoadingConversations: false });
    } catch {
      set({ isLoadingConversations: false });
    }
  },

  fetchMessages: async (conversationId) => {
    set({ isLoadingMessages: true });
    try {
      const [convRes, msgRes] = await Promise.all([
        chatAPI.getConversation(conversationId),
        chatAPI.getMessages(conversationId),
      ]);
      set({
        currentConversation: convRes.data.data.conversation,
        messages: msgRes.data.data.messages,
        isLoadingMessages: false,
      });
    } catch {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (message, conversationId, mode = 'talk') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistic UI: add user message immediately
    const tempUserMsg = {
      _id: 'temp-' + Date.now(),
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isStreaming: true,
      streamingContent: '',
      error: null,
    }));

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, conversationId, mode }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let newConversationId = conversationId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === 'meta') {
              newConversationId = parsed.conversationId;
              if (!conversationId) {
                set((state) => ({
                  currentConversation: {
                    _id: newConversationId,
                    title: message.substring(0, 60),
                    mode: parsed.mode,
                  },
                }));
              }
            } else if (parsed.type === 'chunk') {
              fullContent += parsed.content;
              set({ streamingContent: fullContent });
            } else if (parsed.type === 'error') {
              set({ error: parsed.message, isStreaming: false });
              return;
            } else if (parsed.type === 'done') {
              // Add completed assistant message
              const assistantMsg = {
                _id: parsed.messageId,
                role: 'assistant',
                content: fullContent,
                createdAt: new Date().toISOString(),
              };

              set((state) => ({
                messages: [...state.messages, assistantMsg],
                isStreaming: false,
                streamingContent: '',
              }));

              // Refresh conversations list
              get().fetchConversations();
              return newConversationId;
            }
          } catch {
            // Skip unparseable lines
          }
        }
      }

      // If stream ended without 'done' event
      if (fullContent) {
        set((state) => ({
          messages: [
            ...state.messages,
            { _id: 'ai-' + Date.now(), role: 'assistant', content: fullContent, createdAt: new Date().toISOString() },
          ],
          isStreaming: false,
          streamingContent: '',
        }));
      }

      return newConversationId;
    } catch (err) {
      set({
        error: err.message || 'Something went wrong.',
        isStreaming: false,
        streamingContent: '',
      });
    }
  },

  deleteConversation: async (id) => {
    try {
      await chatAPI.deleteConversation(id);
      set((state) => ({
        conversations: state.conversations.filter((c) => c._id !== id),
        currentConversation: state.currentConversation?._id === id ? null : state.currentConversation,
        messages: state.currentConversation?._id === id ? [] : state.messages,
      }));
    } catch {
      // ignore
    }
  },

  renameConversation: async (id, title) => {
    try {
      await chatAPI.updateConversation(id, { title });
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === id ? { ...c, title } : c
        ),
        currentConversation:
          state.currentConversation?._id === id
            ? { ...state.currentConversation, title }
            : state.currentConversation,
      }));
    } catch {
      // ignore
    }
  },

  startNewChat: () => {
    set({ currentConversation: null, messages: [], streamingContent: '', error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useChatStore;
