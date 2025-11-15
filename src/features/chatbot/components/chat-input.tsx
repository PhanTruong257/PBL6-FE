import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUp } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, onKeyDown, disabled = false }: ChatInputProps) {
  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="flex items-center w-full max-w-2xl mx-auto p-1.5 border-0 rounded-full bg-white shadow-sm sticky bottom-0">
      <Input
        type="text"
        placeholder="Enter your message ..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="flex-1 px-3 py-2 text-sm border-0 bg-transparent focus-visible:ring-0 shadow-none"
        disabled={disabled}
      />
      <Button
        onClick={onSend}
        disabled={!canSend}
        size="icon"
        className={`w-8 h-8 rounded-full mr-1 transition-all duration-200 ${
          canSend
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'
        }`}
      >
        <ArrowUp size={18} />
      </Button>
    </div>
  )
}