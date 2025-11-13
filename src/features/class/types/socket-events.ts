/**
 * Class/Post Socket Event Types
 * Keep in sync with backend's socket-events.dto.ts
 */

/**
 * Socket Event Names for Posts
 */
export const POST_SOCKET_EVENTS = {
  // Client -> Server
  JOIN_CLASS: 'class:join',
  LEAVE_CLASS: 'class:leave',
  CREATE_POST: 'post:create',
  CREATE_REPLY: 'reply:create',

  // Server -> Client
  POST_CREATED: 'post:created',
  REPLY_CREATED: 'reply:created',
  CLASS_JOINED: 'class:joined',
} as const

/**
 * Client -> Server Event Payloads
 */
export interface JoinClassPayload {
  class_id: number
  user_id: number
}

export interface LeaveClassPayload {
  class_id: number
}

export interface CreatePostPayload {
  class_id: number
  sender_id: number
  title?: string
  message: string
}

export interface CreateReplyPayload {
  class_id: number
  parent_id: number
  sender_id: number
  message: string
}

/**
 * Server -> Client Event Responses
 */
export interface PostCreatedResponse {
  id: number
  class_id: number
  sender_id: number
  title?: string
  message: string
  created_at: string
  parent_id?: number | null
}

export interface ReplyCreatedResponse {
  id: number
  class_id: number
  sender_id: number
  message: string
  parent_id: number
  created_at: string
}

export interface ClassJoinedResponse {
  class_id: number
  success: boolean
  members_count: number
}

/**
 * Type-safe event map for Class Socket.IO
 */
export interface ClassServerToClientEvents {
  [POST_SOCKET_EVENTS.POST_CREATED]: (data: PostCreatedResponse) => void
  [POST_SOCKET_EVENTS.REPLY_CREATED]: (data: ReplyCreatedResponse) => void
  [POST_SOCKET_EVENTS.CLASS_JOINED]: (data: ClassJoinedResponse) => void
}

export interface ClassClientToServerEvents {
  [POST_SOCKET_EVENTS.JOIN_CLASS]: (payload: JoinClassPayload) => void
  [POST_SOCKET_EVENTS.LEAVE_CLASS]: (payload: LeaveClassPayload) => void
  [POST_SOCKET_EVENTS.CREATE_POST]: (payload: CreatePostPayload) => void
  [POST_SOCKET_EVENTS.CREATE_REPLY]: (payload: CreateReplyPayload) => void
}
