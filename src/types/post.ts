export interface Post{
    id : number;
    class_id:number;
    parent_id?:number;
    title?:string;
    message?: string;
    sender_id:number;
    created_at:Date;
}