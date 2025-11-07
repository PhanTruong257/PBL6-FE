import { toast as sonnerToast } from 'sonner'

/**
 * Custom toast utility wrapper for consistent toast notifications
 * Uses sonner under the hood with predefined styles
 */
export const toast = {
  /**
   * Show a success toast notification
   */
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Show an info toast notification
   */
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Show a loading toast notification
   * Returns a promise that can be used to update the toast
   */
  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    })
  },

  /**
   * Show a promise toast that automatically updates based on promise state
   */
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    })
  },

  /**
   * Dismiss a specific toast by id or all toasts
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },
}
