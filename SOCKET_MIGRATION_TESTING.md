# Socket Migration to Recoil - Testing Guide

## ✅ Migration Complete

Socket management has been migrated from Context API to Recoil for better state management and performance.

## 📁 New Structure

### Recoil Atoms (`src/global/recoil/socket/`)

- `socketAtoms.ts` - Socket state atoms and selectors
  - `socketInstanceState` - Socket instance
  - `socketConnectionState` - Connection status
  - `presenceMapState` - User presence map
  - `isSocketReadyState` - Selector for socket ready status

### Global Hooks (`src/global/hooks/`)

- `useSocket.ts` - Access socket instance and state
- `useSocketManager.ts` - Manage socket connection lifecycle
- `usePresence.ts` - Manage user presence

### Updated Files

- `src/global/providers/socket-provider.tsx` - Now uses Recoil instead of Context
- All conversation hooks updated to use new `useSocket` hook

## 🧪 Testing Checklist

### 1. Socket Connection

- [ ] Login to application
- [ ] Check console for "✅ [SOCKET] Connected" message
- [ ] Verify socket ID is displayed
- [ ] Check browser DevTools > Network > WS tab for websocket connection

### 2. Chat Functionality

- [ ] Navigate to Messages/Conversations
- [ ] Send a message
- [ ] Verify message is sent and received
- [ ] Check unread count updates
- [ ] Open conversation and verify real-time updates

### 3. User Presence

- [ ] Check if users show online/offline status
- [ ] Open conversation and verify presence indicators
- [ ] Open multiple tabs and verify presence syncs

### 4. Class Posts (If applicable)

- [ ] Navigate to a class
- [ ] Create a new post
- [ ] Verify real-time post appears
- [ ] Add a reply
- [ ] Verify reply appears in real-time

### 5. Reconnection

- [ ] Disconnect network (browser DevTools > Network > Offline)
- [ ] Reconnect network
- [ ] Check console for "🔄 [SOCKET] Reconnection attempt" and "✅ [SOCKET] Reconnected"
- [ ] Verify functionality works after reconnection

### 6. Tab Visibility

- [ ] Switch to another tab for 30 seconds
- [ ] Switch back
- [ ] Verify socket reconnects if needed

### 7. Logout/Login

- [ ] Logout
- [ ] Check console for "🔌 [SOCKET] Cleaning up connection"
- [ ] Login again
- [ ] Verify socket reconnects

## 🔍 Debug Commands

### Check Socket State in Console

```javascript
// In browser console after login
// Note: You'll need to expose recoil state for debugging
console.log('Socket state:' /* access recoil state */)
```

### Monitor Socket Events

Already logged to console with prefixes:

- `🔌 [SOCKET]` - Connection events
- `✅ [SOCKET]` - Success events
- `❌ [SOCKET]` - Error events
- `🔄 [SOCKET]` - Reconnection events
- `🔔 [GLOBAL_SOCKET]` - Message notifications

## ⚠️ Known Issues

None currently. Report any issues found during testing.

## 🎯 Performance Benefits

- **Better State Management**: Recoil atoms are more efficient than Context API
- **Selective Re-renders**: Only components using specific atoms re-render
- **Persistence**: Easier to persist socket state if needed
- **DevTools**: Better debugging with Recoil DevTools extension

## 📝 Usage Examples

### Old Way (Context)

```typescript
import { useGlobalSocket } from '@/global/providers/socket-provider'

function MyComponent() {
  const { socket, isConnected } = useGlobalSocket()
  // ...
}
```

### New Way (Recoil)

```typescript
import { useSocket } from '@/global/hooks'

function MyComponent() {
  const { socket, isConnected } = useSocket()
  // ...same API
}
```

### Advanced: Using Atoms Directly

```typescript
import { useRecoilValue } from 'recoil'
import { socketInstanceState, isSocketReadyState } from '@/global/recoil/socket'

function MyComponent() {
  const socket = useRecoilValue(socketInstanceState)
  const isReady = useRecoilValue(isSocketReadyState)
  // ...
}
```

### Checking User Online Status

```typescript
import { usePresence } from '@/global/hooks'

function MyComponent() {
  const { isUserOnline, requestPresence } = usePresence()

  // Check if user 123 is online
  const isOnline = isUserOnline(123)

  // Request presence for multiple users
  requestPresence([123, 456, 789])
  // ...
}
```

## ✨ What Changed

1. **Socket State**: Moved from Context to Recoil atoms
2. **Hooks**: New centralized hooks in `src/global/hooks/`
3. **Imports**: Changed from `useGlobalSocket` to `useSocket`
4. **Provider**: `GlobalSocketProvider` still exists but now uses Recoil internally
5. **Type Safety**: Maintained full TypeScript type safety
6. **API**: Hook API remains the same for easy migration

## 🚀 Next Steps

After testing, consider:

1. Remove old `SocketContext.tsx` in `features/conversation/context/`
2. Add Recoil DevTools for better debugging
3. Consider persisting socket state if needed
4. Add socket connection indicator in UI
