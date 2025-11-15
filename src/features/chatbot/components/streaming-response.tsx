interface StreamingResponseProps {
  content: string
  aiRef?: React.RefObject<HTMLDivElement>
}

export function StreamingResponse({ content, aiRef }: StreamingResponseProps) {
  if (!content.trim()) return null

  return (
    <div className="flex flex-col gap-2 mb-3 w-full items-start">
      <div className="flex items-center gap-2">
        <img 
          src="/ai.jpg" 
          alt="AI" 
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <span className="text-xs font-semibold text-gray-600">
          Trợ lý ảo HueWACO ChatBot
        </span>
      </div>
      <div 
        ref={aiRef}
        className="px-3.5 py-2.5 rounded-[18px] text-sm leading-relaxed max-w-[70%] bg-gray-100 text-black rounded-bl-1 whitespace-pre-wrap"
      >
        {content}
      </div>
    </div>
  )
}