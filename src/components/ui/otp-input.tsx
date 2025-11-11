import * as React from 'react'
import { cn } from '@/libs/utils'

export interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
  className?: string
  error?: boolean
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className,
  error = false,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Initialize input refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Focus first input on mount
  React.useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, newValue: string) => {
    // Only allow numbers
    if (newValue && !/^\d+$/.test(newValue)) {
      return
    }

    const otpArray = value.split('')
    
    // If pasting multiple digits
    if (newValue.length > 1) {
      const pastedData = newValue.slice(0, length - index)
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < length) {
          otpArray[index + i] = pastedData[i]
        }
      }
      const newOtp = otpArray.join('')
      onChange(newOtp)
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedData.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    // Single digit input
    otpArray[index] = newValue
    const newOtp = otpArray.join('')
    onChange(newOtp)

    // Auto-focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const otpArray = value.split('')
      
      if (otpArray[index]) {
        // Clear current input
        otpArray[index] = ''
        onChange(otpArray.join(''))
      } else if (index > 0) {
        // Move to previous input and clear it
        otpArray[index - 1] = ''
        onChange(otpArray.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    // Select input content on focus
    inputRefs.current[index]?.select()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length)
    
    // Only allow numbers
    if (!/^\d+$/.test(pastedData)) {
      return
    }

    const otpArray = pastedData.split('').concat(Array(length).fill('')).slice(0, length)
    onChange(otpArray.join(''))
    
    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[lastFilledIndex]?.focus()
  }

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-2xl font-semibold',
            'border-2 rounded-lg',
            'transition-all duration-200',
            'bg-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            error
              ? 'border-destructive focus:ring-destructive'
              : 'border-primary',
            disabled && 'opacity-50 cursor-not-allowed bg-muted',
            'hover:border-primary/70',
            '[&:autofill]:!bg-background [&:autofill]:!text-foreground',
            '[&:-webkit-autofill]:!bg-background [&:-webkit-autofill]:!text-foreground'
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
