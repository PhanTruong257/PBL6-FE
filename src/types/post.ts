import type { Material } from "./material";

export interface Post{
    id : number;
    class_id:number;
    parent_id:number;
    message?: string;
    sender_id:number;
    created_at:Date;
    materials: Material[];
}