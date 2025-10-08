import type { Material } from "./material";

export interface Class{
    class_id: number;
    class_name: string;
    class_code: string;
    description?: string;
    teacher_id?: number;
    created_at: Date;
    updated_at?: Date;
    posts:Material[];
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