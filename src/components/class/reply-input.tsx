import { AtSign, Hash, MoreHorizontal, Paperclip, Send, Smile } from "lucide-react";
import { Button } from "../ui/button";

export function replyInput(setHideReplyInput:React.Dispatch<React.SetStateAction<boolean>>){
    return  <div className="flex items-center w-full">
                <div className="flex-1 relative">
                <input
                    type="text"
                    placeholder="Type a new message"
                    className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onBlur={()=>{setHideReplyInput(true)}}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                    <AtSign className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Hash className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                <Send className="h-4 w-4" />
                </Button>
            </div>
}