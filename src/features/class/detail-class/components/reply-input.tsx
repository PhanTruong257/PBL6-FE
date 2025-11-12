import { AtSign, Hash, MessageCircle, MoreHorizontal, Paperclip, Send, Smile } from "lucide-react";
import { Button } from '@/components/ui/button'
import { useState } from "react";
import type { PostCardProps } from "../types";
import { useRecoilValue } from "recoil";
import { currentUserState } from "@/global/recoil/user";
import { cookieStorage } from "@/libs/utils/cookie";

interface ReplyInputProps {
    classId: number
    postId: number
    replies: PostCardProps[]
    onReplyAdded?: () => void
}

export function replyInput({ classId, postId, replies, onReplyAdded }: ReplyInputProps){

    const [reply, setReply] = useState<string>('');
    const [hideReplyInput, setHideReplyInput] = useState<boolean>(true);

    const user = useRecoilValue(currentUserState);
    
    const sendReplyHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (!reply?.trim() || !user) return;

        const accessToken = cookieStorage.getAccessToken();
        const refreshToken = cookieStorage.getRefreshToken();
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            headers['x-refresh-token'] = refreshToken;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/add-new-post`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    class_id: classId,
                    parent_id: postId,
                    message: reply,
                    title: '',
                    sender_id: user.user_id,
                })
            });

            if (!res.ok) {
                throw new Error('Failed to add reply');
            }

            const json = await res.json();
            console.log('Add reply result:', json);
            
            // Add reply to local state
            replies.push({
                id: json.data.id,
                title: json.data.title || '',
                message: json.data.message,
                sender: user,
                created_at: new Date(json.data.created_at),
                replies: [],
            });
            
            setReply('');
            setHideReplyInput(true);
            
            // Callback to refresh parent data if needed
            if (onReplyAdded) {
                onReplyAdded();
            }
        } catch (error) {
            console.error('Error adding reply:', error);
            alert('Failed to add reply. Please try again.');
        }
    };
    

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
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10" 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        sendReplyHandler(e);
                    }}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
}