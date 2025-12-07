# Socket Architecture Documentation - Frontend

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Flow](#architecture-flow)
3. [Core Components](#core-components)
4. [State Management](#state-management)
5. [Connection Lifecycle](#connection-lifecycle)
6. [Presence System](#presence-system)
7. [Usage in Components](#usage-in-components)
8. [Event Handling](#event-handling)
9. [Best Practices](#best-practices)

---

## 🎯 Overview

Socket architecture sử dụng **Socket.IO Client** kết hợp với **Recoil** để quản lý state toàn cục. Socket được khởi tạo ở **app level** (không phải component level) để đảm bảo:

- User online ngay khi đăng nhập
- User offline khi logout/đóng app
- State được chia sẻ giữa tất cả components
- Không bị disconnect khi navigate giữa các routes

---

## 🔄 Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          App Entry Point                         │
│                         (main.tsx)                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        AppProviders                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              TanStackQueryProvider                        │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │           GlobalSocketProvider                      │  │  │
│  │  │  • Wrap toàn bộ app                                 │  │  │
│  │  │  • Initialize socket connection                     │  │  │
│  │  │  • Setup global event listeners                     │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │          ThemeProvider                        │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │         App Routes                      │  │  │  │  │
│  │  │  │  │  • /conversations                       │  │  │  │  │
│  │  │  │  │  • /classes                             │  │  │  │  │
│  │  │  │  │  • /exams                               │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Recoil State (Global)                       │
│  • socketInstanceState         (Socket object)                   │
│  • socketConnectionState       (connection status)               │
│  • presenceMapState            (users online/offline status)     │
│  • presenceInitializedState    (flag to sync presence)           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Custom Hooks                             │
│  • useSocketManager  → Manage connection lifecycle              │
│  • useSocket         → Access socket instance & state            │
│  • usePresence       → Manage user presence (online/offline)     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Feature Components                            │
│  • conversation-list.tsx → useSocket(), usePresence()            │
│  • chat-window.tsx       → useSocket(), usePresence()            │
│  • Any component         → Can use hooks to access socket        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Core Components

### 1. **GlobalSocketProvider** (`src/global/providers/socket-provider.tsx`)

Provider chính wrap toàn bộ app, được mount trong `AppProviders`.

**Responsibilities:**

- Initialize socket connection thông qua `useSocketManager`
- Setup global event listeners (message:received, user:online, user:offline, etc.)
- Cleanup khi unmount

**Code:**

```tsx
export function GlobalSocketProvider({ children }: GlobalSocketProviderProps) {
  const { socket, isConnected } = useSocket()

  // Initialize socket connection
  useSocketManager({
    url: SOCKET_URL,
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  // Setup global event listeners
  useEffect(() => {
    if (!socket || !isConnected) return

    socket.on('message:received', handleMessageReceived)
    socket.on('user:online', handleUserOnline)
    socket.on('user:offline', handleUserOffline)

    return () => {
      socket.off('message:received', handleMessageReceived)
      socket.off('user:online', handleUserOnline)
      socket.off('user:offline', handleUserOffline)
    }
  }, [socket, isConnected])

  return <>{children}</>
}
```

### 2. **useSocketManager** (`src/global/hooks/useSocketManager.ts`)

Hook quản lý lifecycle của socket connection.

**Responsibilities:**

- Create socket instance với Socket.IO client
- Handle connection, disconnection, reconnection
- Sync với `currentUserState` - chỉ connect khi user đã login
- Update Recoil state: `socketInstanceState`, `socketConnectionState`

**Connection Logic:**

```typescript
const connect = useCallback(() => {
  if (!currentUser?.user_id) {
    console.log('No user logged in, skipping connection')
    return null
  }

  const socket = io(url, {
    query: { userId: userId.toString() }, // ⭐ Gửi userId để backend identify
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    autoConnect: true,
  }) as TypedSocket

  // Event handlers: connect, disconnect, connect_error, reconnect, etc.
  socket.on('connect', () => {
    setConnectionState({ isConnected: true, ... })
  })

  setSocket(socket)
  return socket
}, [currentUser?.user_id, url, ...])
```

**Auto-connect Logic:**

```typescript
useEffect(() => {
  if (!currentUser?.user_id) {
    disconnect() // ⭐ Logout → disconnect
    return
  }

  const socket = connect() // ⭐ User detected → connect

  return () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
  }
}, [currentUser?.user_id])
```

### 3. **useSocket** (`src/global/hooks/useSocket.ts`)

Simple hook để access socket instance và connection state từ Recoil.

```typescript
export function useSocket() {
  const socket = useRecoilValue(socketInstanceState)
  const connectionState = useRecoilValue(socketConnectionState)
  const isReady = useRecoilValue(isSocketReadyState)

  return {
    socket, // TypedSocket | null
    isConnected, // boolean
    isConnecting, // boolean
    error, // Error | null
    reconnectAttempt, // number
    isReady, // boolean (socket !== null && isConnected)
  }
}
```

### 4. **usePresence** (`src/global/hooks/usePresence.ts`)

Hook quản lý user presence (online/offline status).

**Key Features:**

- Set online khi socket connects (chỉ 1 lần - dùng `presenceInitializedState`)
- Handle USER_ONLINE, USER_OFFLINE events từ server
- Request presence cho specific users
- Set offline khi user đóng/refresh trang (`beforeunload` event)
- **KHÔNG** set offline khi component unmount (vì user vẫn đang login)

**Critical Logic:**

```typescript
// Set online when socket connects
useEffect(() => {
  if (!socket || !userId) {
    setPresenceInitialized(false)
    return
  }

  // Set online if connected and not yet initialized
  if (socket.connected && !presenceInitialized) {
    updatePresence(PresenceStatus.ONLINE)
    setPresenceInitialized(true) // ⭐ Flag to prevent duplicate
  }

  const handleConnect = () => {
    if (!presenceInitialized) {
      updatePresence(PresenceStatus.ONLINE)
      setPresenceInitialized(true)
    }
  }

  socket.on('connect', handleConnect)

  return () => {
    socket.off('connect', handleConnect)
    // ⚠️ DON'T set offline here - user still logged in
  }
}, [socket, userId, presenceInitialized])

// Set offline when page closes
useEffect(() => {
  const handleBeforeUnload = () => {
    if (socket?.connected) {
      socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
        user_id: userId,
        status: PresenceStatus.OFFLINE,
        last_seen: new Date().toISOString(),
      })
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => window.removeEventListener('beforeunload', handleBeforeUnload)
}, [socket, userId])
```

---

## 🗄️ State Management

### Recoil Atoms

File: `src/global/recoil/socket/socketAtoms.ts`

#### 1. **socketInstanceState**

```typescript
export const socketInstanceState = atom<TypedSocket | null>({
  key: 'socketInstanceState',
  default: null,
  dangerouslyAllowMutability: true, // Socket is not serializable
})
```

- Store socket instance
- `TypedSocket` = Socket với typed events (ServerToClientEvents, ClientToServerEvents)

#### 2. **socketConnectionState**

```typescript
export const socketConnectionState = atom<{
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
  reconnectAttempt: number
}>({
  key: 'socketConnectionState',
  default: {
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempt: 0,
  },
})
```

- Track connection status
- Used để show loading, error states trong UI

#### 3. **presenceMapState**

```typescript
export interface PresenceMap {
  [userId: number]: {
    status: PresenceStatus // 'online' | 'offline' | 'away'
    lastSeen?: string
  }
}

export const presenceMapState = atom<PresenceMap>({
  key: 'presenceMapState',
  default: {},
})
```

- Store online/offline status của tất cả users
- Updated qua USER_ONLINE, USER_OFFLINE, PRESENCE_LIST events

#### 4. **presenceInitializedState**

```typescript
export const presenceInitializedState = atom<boolean>({
  key: 'presenceInitializedState',
  default: false,
})
```

- Flag để đồng bộ việc set online
- Đảm bảo chỉ set online 1 lần khi socket connect
- Reset về false khi disconnect

### Recoil Selectors

#### **isSocketReadyState**

```typescript
export const isSocketReadyState = selector({
  key: 'isSocketReadyState',
  get: ({ get }) => {
    const socket = get(socketInstanceState)
    const connection = get(socketConnectionState)
    return socket !== null && connection.isConnected
  },
})
```

- Derived state: socket ready to use
- Used để check trước khi emit events

#### **userOnlineStatusSelector**

```typescript
export const userOnlineStatusSelector = (userId: number) =>
  selector({
    key: `userOnlineStatus_${userId}`,
    get: ({ get }) => {
      const presenceMap = get(presenceMapState)
      return presenceMap[userId]?.status === 'online'
    },
  })
```

- Check specific user online status
- Used trong UI để show green/red dot

---

## 🔄 Connection Lifecycle

### 1. **App Start (No User)**

```
User not logged in
  ↓
currentUser = null
  ↓
useSocketManager detects no user
  ↓
Socket NOT created
  ↓
socketInstanceState = null
  ↓
Components see socket = null, don't emit events
```

### 2. **User Login**

```
User logs in successfully
  ↓
currentUser = { user_id, email, ... }
  ↓
useSocketManager effect triggers (dependency: currentUser.user_id)
  ↓
connect() function called
  ↓
io(url, { query: { userId } }) creates socket
  ↓
Socket connects to backend
  ↓
Backend receives connection with userId
  ↓
'connect' event fired
  ↓
setConnectionState({ isConnected: true })
setSocket(socket) → socketInstanceState updated
  ↓
usePresence effect triggers (dependency: socket, userId)
  ↓
presenceInitialized = false → set online
socket.emit(PRESENCE_UPDATE, { user_id, status: ONLINE })
setPresenceInitialized(true)
  ↓
Backend broadcasts USER_ONLINE to all clients
  ↓
All clients receive USER_ONLINE event
  ↓
presenceMap[user_id] = { status: 'online', lastSeen: ... }
  ↓
✅ User appears ONLINE in all conversations
```

### 3. **User Navigates Between Routes**

```
User navigates from /conversations to /classes
  ↓
conversation-list.tsx unmounts
chat-window.tsx unmounts
  ↓
⚠️ usePresence cleanup runs
  ↓
But cleanup does NOT set offline (by design)
  ↓
Socket remains connected (GlobalSocketProvider still mounted)
  ↓
User still ONLINE
  ↓
User navigates back to /conversations
  ↓
conversation-list.tsx mounts again
  ↓
usePresence hook called again
  ↓
presenceInitialized = true → don't set online again
  ↓
✅ No duplicate PRESENCE_UPDATE emitted
```

### 4. **User Closes/Refreshes Page**

```
User closes tab or presses F5
  ↓
'beforeunload' event fires
  ↓
usePresence beforeunload handler
  ↓
socket.emit(PRESENCE_UPDATE, { status: OFFLINE })
  ↓
Backend receives OFFLINE
  ↓
Backend broadcasts USER_OFFLINE
  ↓
Socket disconnects
  ↓
Backend cleanup also sets offline (fallback)
  ↓
✅ User appears OFFLINE to all clients
```

### 5. **User Logs Out**

```
User clicks logout button
  ↓
logout() function called
  ↓
currentUser set to null
  ↓
useSocketManager effect triggers (dependency: currentUser.user_id)
  ↓
No user detected → disconnect() called
  ↓
socket.disconnect()
setSocket(null)
  ↓
Backend detects disconnect
  ↓
Backend sets user offline
  ↓
Backend broadcasts USER_OFFLINE
  ↓
✅ User appears OFFLINE to all clients
```

### 6. **Network Disconnect (Auto-Reconnect)**

```
Network drops
  ↓
'disconnect' event fires (reason: 'transport close')
  ↓
setConnectionState({ isConnected: false })
setPresenceInitialized(false)
  ↓
Socket.IO auto-reconnect starts
  ↓
'reconnect_attempt' event (attempt 1/5)
  ↓
... retry with exponential backoff ...
  ↓
Network restored
  ↓
'reconnect' event fires
  ↓
'connect' event fires
  ↓
setConnectionState({ isConnected: true })
  ↓
usePresence detects reconnect
  ↓
presenceInitialized = false → set online again
  ↓
✅ User back ONLINE
```

---

## 👤 Presence System

### Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Frontend                               │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │             usePresence Hook                             │ │
│  │                                                          │ │
│  │  • updatePresence(status)                               │ │
│  │  • requestPresence(userIds)                             │ │
│  │  • isUserOnline(userId)                                 │ │
│  │  • presenceMap state                                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                    │
│                           │ Socket Events                      │
│                           ▼                                    │
└────────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
         ┌──────────▼──────────┐ ┌──▼─────────────────┐
         │  PRESENCE_UPDATE    │ │  REQUEST_PRESENCE  │
         │  { user_id, status }│ │  { user_ids: [] }  │
         └─────────────────────┘ └────────────────────┘
                    │                      │
                    ▼                      ▼
┌────────────────────────────────────────────────────────────────┐
│                         Backend                                │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │          PresenceService (In-Memory Map)                 │ │
│  │                                                          │ │
│  │  Map<userId, { status, lastSeen, socketId }>           │ │
│  │                                                          │ │
│  │  • setOnline(userId, socketId)                          │ │
│  │  • setOffline(userId)                                   │ │
│  │  • getPresence(userId)                                  │ │
│  │  • getPresences(userIds)                                │ │
│  │  • getAllOnlineUsers()                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                    │
│                           │ Broadcast                          │
│                           ▼                                    │
└────────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
         ┌──────────▼──────────┐ ┌──▼─────────────────┐
         │    USER_ONLINE      │ │   USER_OFFLINE     │
         │  { user_id, status }│ │  { user_id, ... }  │
         └─────────────────────┘ └────────────────────┘
                    │                      │
                    ▼                      ▼
┌────────────────────────────────────────────────────────────────┐
│                    All Connected Clients                       │
│                                                                │
│  • Update presenceMap state                                   │
│  • Show green/red dot in UI                                   │
└────────────────────────────────────────────────────────────────┘
```

### Events Flow

#### **Set Online Flow**

```
1. Frontend: socket.emit('presence:update', { user_id: 123, status: 'online' })
2. Backend: PresenceService.setOnline(123, socketId)
3. Backend: server.emit('user:online', { user_id: 123, status: 'online', last_seen: ... })
4. All Clients: presenceMap[123] = { status: 'online', lastSeen: ... }
5. UI: Show green dot for user 123
```

#### **Request Presence Flow**

```
1. Frontend: socket.emit('request_presence', { user_ids: [123, 456, 789] })
2. Backend: PresenceService.getPresences([123, 456, 789])
3. Backend: socket.emit('presence:list', [
     { user_id: 123, status: 'online', ... },
     { user_id: 456, status: 'offline', ... },
     { user_id: 789, status: 'online', ... }
   ])
4. Frontend: Update presenceMap with all users' status
5. UI: Show correct status for all users
```

#### **Set Offline Flow**

```
1. Frontend: window closes OR logout
2. Frontend: socket.emit('presence:update', { user_id: 123, status: 'offline' })
   OR socket disconnects
3. Backend: PresenceService.setOffline(123)
4. Backend: server.emit('user:offline', { user_id: 123, status: 'offline', ... })
5. All Clients: presenceMap[123] = { status: 'offline', lastSeen: ... }
6. UI: Remove green dot OR show "Offline" text
```

---

## 💻 Usage in Components

### Example: conversation-list.tsx

```tsx
import { useSocket, usePresence } from '@/global/hooks'

export function ConversationList() {
  const { socket } = useSocket()
  const { isUserOnline, requestPresence } = usePresence()

  // Request presence for all conversation participants
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      const userIds = conversations
        .map((conv) => getReceiverId(conv, currentUserId))
        .filter((id): id is number => id !== undefined)

      if (userIds.length > 0) {
        requestPresence(userIds) // ⭐ Batch request
      }
    }
  }, [conversations, currentUserId, requestPresence])

  // Listen to real-time message events
  useEffect(() => {
    if (!socket) return

    const handleMessageReceived = (data: MessageReceivedPayload) => {
      console.log('New message:', data)
      refetchConversations()
    }

    socket.on('message:received', handleMessageReceived)
    return () => {
      socket.off('message:received', handleMessageReceived)
    }
  }, [socket, refetchConversations])

  return (
    <div>
      {conversations.map((conversation) => {
        const receiverId = getReceiverId(conversation, currentUserId)
        const online = isUserOnline(receiverId) // ⭐ Check status

        return (
          <div key={conversation.id}>
            <Avatar>
              {/* Show green dot if online */}
              {online && (
                <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </Avatar>
            <span>{conversation.name}</span>
          </div>
        )
      })}
    </div>
  )
}
```

### Example: chat-window.tsx

```tsx
import { useSocket, usePresence } from '@/global/hooks'

export function ChatWindow({ conversationId }: Props) {
  const { socket, isConnected } = useSocket()
  const { isUserOnline, requestPresence } = usePresence()

  // Send message
  const handleSendMessage = () => {
    if (!socket || !isConnected) {
      toast.error('Not connected to chat server')
      return
    }

    socket.emit('message:send', {
      conversation_id: conversationId,
      content: messageText,
      sender_id: currentUser.user_id,
    })
  }

  // Listen for new messages in this conversation
  useEffect(() => {
    if (!socket) return

    const handleMessageReceived = (data: MessageReceivedPayload) => {
      if (data.conversation_id === conversationId) {
        refetchMessages()
      }
    }

    socket.on('message:received', handleMessageReceived)
    return () => {
      socket.off('message:received', handleMessageReceived)
    }
  }, [socket, conversationId, refetchMessages])

  const receiverOnline = isUserOnline(receiverId)

  return (
    <div>
      <div className="header">
        <Avatar>
          {receiverOnline && (
            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </Avatar>
        <span>{receiverName}</span>
        <span className="text-xs text-muted-foreground">
          {receiverOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="messages">{/* Render messages */}</div>

      <form onSubmit={handleSendMessage}>
        <input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit" disabled={!isConnected}>
          Send
        </button>
      </form>
    </div>
  )
}
```

---

## 📡 Event Handling

### Socket Events Types

File: `src/features/conversation/types/socket-events.ts`

```typescript
// Client → Server Events
export interface ClientToServerEvents {
  // Messages
  'message:send': (data: SendMessagePayload) => void
  'message:edit': (data: EditMessagePayload) => void
  'message:delete': (data: DeleteMessagePayload) => void

  // Presence
  'presence:update': (data: PresenceUpdatePayload) => void
  request_presence: (data: RequestPresencePayload) => void

  // Conversations
  'conversation:create': (data: CreateConversationPayload) => void
}

// Server → Client Events
export interface ServerToClientEvents {
  // Messages
  'message:received': (data: MessageReceivedPayload) => void
  'message:status': (data: MessageStatusPayload) => void

  // Presence
  'user:online': (data: UserPresenceResponse) => void
  'user:offline': (data: UserPresenceResponse) => void
  'presence:list': (data: UserPresenceResponse[]) => void

  // Connection
  connect: () => void
  disconnect: (reason: string) => void
  connect_error: (error: Error) => void
}
```

### Event Constants

File: `src/features/conversation/types/socket-events.ts`

```typescript
export const SOCKET_EVENTS = {
  // Messages
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_STATUS: 'message:status',

  // Presence
  PRESENCE_UPDATE: 'presence:update',
  REQUEST_PRESENCE: 'request_presence',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  PRESENCE_LIST: 'presence:list',

  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const
```

---

## ✅ Best Practices

### 1. **Always Check Socket Connection**

```typescript
// ❌ Bad
socket.emit('message:send', data)

// ✅ Good
if (socket?.connected) {
  socket.emit('message:send', data)
} else {
  toast.error('Not connected to chat server')
}
```

### 2. **Always Cleanup Event Listeners**

```typescript
useEffect(() => {
  if (!socket) return

  const handler = (data) => {
    /* ... */
  }

  socket.on('message:received', handler)

  return () => {
    socket.off('message:received', handler) // ⭐ Critical!
  }
}, [socket])
```

### 3. **Use Typed Socket**

```typescript
// ✅ Type-safe events
const { socket } = useSocket()

// IDE autocomplete and type checking
socket?.emit('message:send', {
  conversation_id: 123,
  content: 'Hello',
  sender_id: 456,
})
```

### 4. **Batch Presence Requests**

```typescript
// ❌ Bad: Multiple requests
userIds.forEach((id) => requestPresence([id]))

// ✅ Good: Single batch request
requestPresence(userIds)
```

### 5. **Use Recoil for Shared State**

```typescript
// ✅ Components automatically re-render when state changes
const { socket } = useSocket() // Auto-updates
const { presenceMap } = usePresence() // Auto-updates
const isOnline = isUserOnline(userId) // Auto-updates
```

### 6. **Handle Errors Gracefully**

```typescript
const { error, reconnectAttempt } = useSocket()

if (error) {
  return <ErrorBanner message="Connection failed" retry={reconnect} />
}

if (reconnectAttempt > 0) {
  return <Banner message={`Reconnecting... (${reconnectAttempt}/5)`} />
}
```

### 7. **Don't Set Offline on Component Unmount**

```typescript
// ❌ Bad: Sets offline when navigating away
useEffect(() => {
  return () => {
    socket?.emit('presence:update', { status: 'offline' })
  }
}, [])

// ✅ Good: Only set offline on page close
useEffect(() => {
  const handleBeforeUnload = () => {
    socket?.emit('presence:update', { status: 'offline' })
  }
  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => window.removeEventListener('beforeunload', handleBeforeUnload)
}, [])
```

### 8. **Use presenceInitialized Flag**

```typescript
// Prevents duplicate online status updates
if (socket.connected && !presenceInitialized) {
  updatePresence(PresenceStatus.ONLINE)
  setPresenceInitialized(true) // ⭐ Mark as initialized
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: User not showing online after login

**Cause:** `presenceInitialized` stuck at true  
**Solution:** Reset `presenceInitialized` to false on disconnect

### Issue 2: User shows offline when navigating between tabs

**Cause:** Setting offline in component cleanup  
**Solution:** Remove offline emit from component unmount, only use `beforeunload`

### Issue 3: Socket connects multiple times

**Cause:** `useSocketManager` effect dependencies causing re-runs  
**Solution:** Use `eslint-disable` and only depend on `currentUser?.user_id`

### Issue 4: Events not received in component

**Cause:** Forgot to cleanup listeners  
**Solution:** Always return cleanup function in useEffect

### Issue 5: Presence not syncing across components

**Cause:** Local state instead of Recoil  
**Solution:** Always use `presenceMapState` from Recoil

---

## 📝 Summary

### Key Takeaways

1. **App-Level Socket**: Socket khởi tạo ở `GlobalSocketProvider`, không phải component level
2. **Recoil for State**: Tất cả socket state (instance, connection, presence) đều dùng Recoil
3. **Auto Connect/Disconnect**: Socket tự động connect khi login, disconnect khi logout
4. **Presence System**: Online khi connect, offline khi đóng app/logout
5. **Type Safety**: Sử dụng TypeScript types cho tất cả events
6. **Cleanup**: Luôn cleanup event listeners để tránh memory leak
7. **Error Handling**: Handle connection errors, reconnection gracefully

### File Structure

```
src/
├── global/
│   ├── providers/
│   │   ├── app-providers.tsx         # Root providers
│   │   └── socket-provider.tsx       # GlobalSocketProvider
│   ├── hooks/
│   │   ├── useSocketManager.ts       # Connection lifecycle
│   │   ├── useSocket.ts              # Access socket instance
│   │   └── usePresence.ts            # Presence management
│   └── recoil/
│       └── socket/
│           ├── socketAtoms.ts        # Recoil atoms & selectors
│           └── index.ts              # Exports
├── features/
│   └── conversation/
│       ├── components/
│       │   ├── conversation-list.tsx  # Uses useSocket, usePresence
│       │   └── chat-window.tsx        # Uses useSocket, usePresence
│       └── types/
│           └── socket-events.ts       # Event types & constants
```

---

**Document Version:** 1.0  
**Last Updated:** December 7, 2025  
**Author:** PBL6 Development Team
