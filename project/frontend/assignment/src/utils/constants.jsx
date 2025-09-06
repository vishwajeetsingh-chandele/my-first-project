// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  HIRING_MANAGER: 'hiring_manager'
}

// Available roles for registration (all 3 roles allowed)
export const REGISTRATION_ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  HIRING_MANAGER: 'hiring_manager'
}

// Candidate statuses
export const CANDIDATE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  HIRED: 'hired',
  REJECTED: 'rejected'
}

// Note types
export const NOTE_TYPES = {
  NOTE: 'note',
  FEEDBACK: 'feedback',
  INTERVIEW_NOTE: 'interview_note',
  DECISION: 'decision'
}

// Note priorities
export const NOTE_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
}

// Notification types
export const NOTIFICATION_TYPES = {
  NEW_NOTE: 'new_note',
  MENTION: 'mention',
  ASSIGNMENT: 'assignment',
  STATUS_CHANGE: 'status_change'
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  CANDIDATES: {
    LIST: '/candidates',
    CREATE: '/candidates',
    GET: (id) => `/candidates/${id}`,
    UPDATE: (id) => `/candidates/${id}`,
    DELETE: (id) => `/candidates/${id}`,
    ASSIGN: (id) => `/candidates/${id}/assign`,
    REMOVE_ASSIGNMENT: (id, userId) => `/candidates/${id}/assign/${userId}`,
    STATS: (id) => `/candidates/${id}/stats`
  },
  NOTES: {
    BY_CANDIDATE: (candidateId) => `/notes/candidate/${candidateId}`,
    GET: (noteId) => `/notes/${noteId}`,
    CREATE: (candidateId) => `/notes/candidate/${candidateId}`,
    UPDATE: (noteId) => `/notes/${noteId}`,
    DELETE: (noteId) => `/notes/${noteId}`,
    REACTION: (noteId) => `/notes/${noteId}/reaction`,
    SEARCH: '/notes/search'
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`,
    BY_CANDIDATE: (candidateId) => `/notifications/by-candidate/${candidateId}`,
    STATS: '/notifications/stats'
  },
  USERS: {
    LIST: '/users',
    GET: (id) => `/users/${id}`,
    SEARCH_MENTIONS: '/users/search/mentions',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    STATS: '/users/stats/overview'
  }
}

// Socket events
export const SOCKET_EVENTS = {
  // Client to Server
  JOIN_CANDIDATE_ROOM: 'joinCandidateRoom',
  LEAVE_CANDIDATE_ROOM: 'leaveCandidateRoom',
  CREATE_NOTE: 'createNote',
  UPDATE_NOTE: 'updateNote',
  DELETE_NOTE: 'deleteNote',
  TYPING: 'typing',
  UPDATE_PRESENCE: 'updatePresence',
  GET_ONLINE_USERS: 'getOnlineUsers',
  MARK_NOTIFICATION_READ: 'markNotificationRead',
  
  // Server to Client
  NEW_NOTE: 'newNote',
  NOTE_UPDATED: 'noteUpdated',
  NOTE_DELETED: 'noteDeleted',
  USER_JOINED_ROOM: 'userJoinedRoom',
  USER_LEFT_ROOM: 'userLeftRoom',
  USER_TYPING: 'userTyping',
  USER_PRESENCE_UPDATE: 'userPresenceUpdate',
  NOTIFICATION: 'notification',
  UNREAD_COUNT_UPDATE: 'unreadCountUpdate',
  ONLINE_USERS: 'onlineUsers'
}

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}

// Form validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  CONTENT_MAX_LENGTH: 5000
}

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm'
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
}

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4'
}

// Status colors
export const STATUS_COLORS = {
  [CANDIDATE_STATUS.ACTIVE]: '#10B981',
  [CANDIDATE_STATUS.INACTIVE]: '#6B7280',
  [CANDIDATE_STATUS.HIRED]: '#3B82F6',
  [CANDIDATE_STATUS.REJECTED]: '#EF4444'
}

// Priority colors
export const PRIORITY_COLORS = {
  [NOTE_PRIORITIES.LOW]: '#6B7280',
  [NOTE_PRIORITIES.MEDIUM]: '#3B82F6',
  [NOTE_PRIORITIES.HIGH]: '#F59E0B',
  [NOTE_PRIORITIES.URGENT]: '#EF4444'
}

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 5
}

// Debounce delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  TYPING: 1000,
  AUTO_SAVE: 2000
}

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}
