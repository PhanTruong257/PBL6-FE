import { AtSign, Hash, MessageCircle, MoreHorizontal, Paperclip, Send, Smile } from "lucide-react";
import { Button } from '@/components/ui/button'
import { useState } from "react";
import { mockClassInfo, mockUser } from "../mock-data";
import type { PostCardProps } from "../types";

export function replyInput(replies: PostCardProps[]){

    const [reply, setReply] = useState<string>();
    const [hideReplyInput, setHideReplyInput] = useState<boolean>(true);

    const user = mockUser;
    const classInfo = mockClassInfo;
    
    const sendReplyHandler = async (e:React.MouseEvent<HTMLButtonElement>) =>{
        const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/add-new-post`,{
            method:'POST',
            body:JSON.stringify({
                class_id: classInfo.class_id,
                parentId: null,
                message: reply,
                title: '',
                sender_id: user.user_id,
            })
        })
        setReply('');
        const json = await res.json();
        console.log('Add reply result:', json);    
        replies.push({
            id: json.data.id,
            title: json.data.title,
            message: json.data.message,
            sender: user,
            created_at: json.data.created_at,
            replies:[],
        })
    }
    

    return hideReplyInput?
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={()=>setHideReplyInput(!hideReplyInput)}>
                <MessageCircle className="h-4 w-4 mr-1" />
                Reply
            </Button>
            :
            <div className="flex items-center w-full">
                <div className="flex-1 relative">
                <input
                    type="text"
                    placeholder="Type a new message"
                    className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onBlur={()=>{setHideReplyInput(true)}}
                    onChange={(e)=>setReply(e.target.value)}
                    value={reply}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={e=>e.preventDefault()}>
                    <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={e=>e.preventDefault()}>
                    <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={e=>e.preventDefault()}>
                    <AtSign className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={e=>e.preventDefault()}>
                    <Hash className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={e=>e.preventDefault()}>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10" onMouseDown={e=>e.preventDefault()}>
                <Send className="h-4 w-4" />
                </Button>
            </div>
}