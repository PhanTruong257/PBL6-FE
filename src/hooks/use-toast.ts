/**
 * Simple toast hook for notifications
 * Can be replaced with a more sophisticated toast library later
 */
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  title?: string
  description?: string
  variant?: ToastType
}

export function useToast() {
  const toast = ({ title, description, variant = 'info' }: ToastOptions) => {
    const message = description || title || 'Notification'
    
    // For now, use browser notifications
    // TODO: Replace with a proper toast component
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️',
    }
    
    const icon = icons[variant]
    console.log(`${icon} ${title || ''}${title && description ? ': ' : ''}${description || ''}`)
    
    // Simple alert for now - can be replaced with toast UI
    if (variant === 'error') {
      alert(`${icon} ${message}`)
    } else {
      // Show brief notification
      showNotification(`${icon} ${message}`, variant)
    }
  }

  return { toast }
}

// Simple notification helper
function showNotification(message: string, type: ToastType = 'info') {
  const notification = document.createElement('div')
  
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
    warning: '#F59E0B',
  }
  
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 24px;
    padding: 16px 24px;
    border-radius: 10px;
    background: ${colors[type]};
    color: white;
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `
  
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease reverse'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}
