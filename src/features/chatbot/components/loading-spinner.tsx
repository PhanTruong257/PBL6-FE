interface LoadingSpinnerProps {
  spinnerRef?: React.RefObject<HTMLDivElement>
}

export function LoadingSpinner({ spinnerRef }: LoadingSpinnerProps) {
  return (
    <div 
      ref={spinnerRef}
      className="flex items-center gap-2 self-start p-1 px-2 rounded-xl bg-transparent"
    >
      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500 italic">Thinking...</p>
    </div>
  )
}