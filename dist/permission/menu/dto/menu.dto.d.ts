export declare class CreateMenuDto {
    parent_id?: number;
    name: string;
    component?: string;
    redirect?: string;
    path?: string;
    status?: number;
    meta?: Record<string, any>;
    sort?: number;
    remark?: string;
}
export declare class UpdateMenuDto {
    parent_id?: number;
    name?: string;
    component?: string;
    redirect?: string;
    path?: string;
    status?: number;
    meta?: Record<string, any>;
    sort?: number;
    remark?: string;
}
