import type { User } from "./user";

export enum FileType {
    document = 'document',
    image = 'image',
    video = 'video',
    audio = 'audio',
    other = 'other'
}


export interface Material{
    material_id: number;
    post_id?:number;     
    title :string;
    file_url: string;
    uploaded_by: number; 
    uploaded_at: Date;
    type: FileType;
    file_size: number;
}

export interface Material_full_info{
    material_id: number;
    post_id?:number;     
    title :string;
    file_url: string;
    uploaded_by: User; 
    uploaded_at: Date;
    type: FileType;
    file_size: number;
}