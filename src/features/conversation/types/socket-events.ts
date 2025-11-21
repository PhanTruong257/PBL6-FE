/**
 * Shared Socket Event Types between Frontend and Backend
 * Keep in sync with backend's socket-events.dto.ts
 */

/**
 * Message Status Enum
 */
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

/**
 * Message Type Enum
 */
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

/**
 * User Presence Status
 */
export enum PresenceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
}

/**
 * Socket Event Names - Type-safe event names
 */
export const SOCKET_EVENTS = {
  // Client -> Server
  SEND_MESSAGE: 'message:send',
  JOIN_CONVERSATION: 'conversation:join',
  LEAVE_CONVERSATION: 'conversation:leave',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  MESSAGE_DELIVERED: 'message:delivered',
  MESSAGE_READ: 'message:read',
  PRESENCE_UPDATE: 'presence:update',
  REQUEST_PRESENCE: 'presence:request',

  // Server -> Client
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_SENT: 'message:sent',
  MESSAGE_STATUS_UPDATED: 'message:status',
  MESSAGE_ERROR: 'message:error',
  CONVERSATION_JOINED: 'conversation:joined',
  USER_TYPING: 'user:typing',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  USER_PRESENCE: 'user:presence',
  PRESENCE_LIST: 'presence:list',
  ERROR: 'error',
  RECONNECTED: 'reconnected',
} as const

/**
 * Client -> Server Event Payloads
 */
export interface SendMessagePayload {
  sender_id: number
  conversation_id: number
  content: string
  message_type?: MessageType
  client_id?: string
  reply_to_id?: string
}

export interface JoinConversationPayload {
  conversation_id: number
  user_id: number
}

export interface LeaveConversationPayload {
  conversation_id: number
}

export interface TypingPayload {
  conversation_id: number
  user_id: number
  is_typing: boolean
}

export interface MessageDeliveredPayload {
  message_id: number
  user_id: number
  delivered_at: string
}

export interface MessageReadPayload {
  conversation_id: number
  user_id: number
  last_read_message_id: number
  read_at: string
}

export interface PresenceUpdatePayload {
  user_id: number
  status: PresenceStatus
  last_seen?: string
}

export interface RequestPresencePayload {
  user_ids: number[]
}

/**
 * Server -> Client Event Responses
 */
export interface MessageReceivedResponse {
  id: number
  sender_id: number
  conversation_id: number
  content: string
  message_type: MessageType
  timestamp: string
  status: MessageStatus
  client_id?: string
  reply_to_id?: string
  edited_at?: string
  file_url?: string
  file_name?: string
  file_size?: number
}

export interface MessageSentResponse extends MessageReceivedResponse {}

export interface MessageStatusUpdatedResponse {
  message_id?: number
  conversation_id?: number
  last_read_message_id?: number
  status: MessageStatus
  delivered_at?: string
  read_at?: string
  read_by?: number
}

export interface MessageErrorResponse {
  message: string
  code?: string
  details?: {
    client_id?: string
    [key: string]: any
  }
}

export interface ConversationJoinedResponse {
  conversation_id: number
  success: boolean
  participants: number[]
  online_participants: number[]
}

export interface UserTypingResponse {
  conversation_id: number
  user_id: number
  is_typing: boolean
  user_name?: string
}

export interface UserPresenceResponse {
  user_id: number
  status: PresenceStatus
  last_seen?: string
}

export interface PresenceListResponse {
  user_id: number
  status: PresenceStatus
  last_seen?: string
}

export interface ErrorResponse {
  message: string
  code?: string
  details?: any
}

export interface ReconnectedResponse {
  userId: number
  timestamp: string
}

/**
 * Type-safe event map for Socket.IO
 */
export interface ServerToClientEvents {
  [SOCKET_EVENTS.MESSAGE_RECEIVED]: (data: MessageReceivedResponse) => void
  [SOCKET_EVENTS.MESSAGE_SENT]: (data: MessageSentResponse) => void
  [SOCKET_EVENTS.MESSAGE_STATUS_UPDATED]: (
    data: MessageStatusUpdatedResponse,
  ) => void
  [SOCKET_EVENTS.MESSAGE_ERROR]: (data: MessageErrorResponse) => void
  [SOCKET_EVENTS.CONVERSATION_JOINED]: (
    data: ConversationJoinedResponse,
  ) => void
  [SOCKET_EVENTS.USER_TYPING]: (data: UserTypingResponse) => void
  [SOCKET_EVENTS.USER_ONLINE]: (data: UserPresenceResponse) => void
  [SOCKET_EVENTS.USER_OFFLINE]: (data: UserPresenceResponse) => void
  [SOCKET_EVENTS.USER_PRESENCE]: (data: UserPresenceResponse) => void
  [SOCKET_EVENTS.PRESENCE_LIST]: (data: PresenceListResponse[]) => void
  [SOCKET_EVENTS.ERROR]: (data: ErrorResponse) => void
  [SOCKET_EVENTS.RECONNECTED]: (data: ReconnectedResponse) => void
}

export interface ClientToServerEvents {
  [SOCKET_EVENTS.SEND_MESSAGE]: (payload: SendMessagePayload) => void
  [SOCKET_EVENTS.JOIN_CONVERSATION]: (payload: JoinConversationPayload) => void
  [SOCKET_EVENTS.LEAVE_CONVERSATION]: (
    payload: LeaveConversationPayload,
  ) => void
  [SOCKET_EVENTS.TYPING_START]: (payload: TypingPayload) => void
  [SOCKET_EVENTS.TYPING_STOP]: (payload: TypingPayload) => void
  [SOCKET_EVENTS.MESSAGE_DELIVERED]: (payload: MessageDeliveredPayload) => void
  [SOCKET_EVENTS.MESSAGE_READ]: (payload: MessageReadPayload) => void
  [SOCKET_EVENTS.PRESENCE_UPDATE]: (payload: PresenceUpdatePayload) => void
  [SOCKET_EVENTS.REQUEST_PRESENCE]: (payload: RequestPresencePayload) => void
}
