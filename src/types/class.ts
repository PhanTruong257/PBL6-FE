import type { Post } from "./post";

export interface Class{
    class_id: number;
    class_name: string;
    class_code: string;
    description?: string;
    teacher_id?: number;
    created_at: Date;
    updated_at?: Date;
    posts:Post[];
}

export interface ClassBasicInfo{
    class_id: number;
    class_name: string;
    class_code: string;
    description?: string;
    teacher_id?: number;
    created_at: Date;
    updated_at?: Date;
}