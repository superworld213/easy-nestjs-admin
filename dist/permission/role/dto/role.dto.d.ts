export declare class CreateRoleDto {
    name: string;
    code: string;
    status?: number;
    sort?: number;
    remark?: string;
}
export declare class UpdateRoleDto {
    name?: string;
    code?: string;
    status?: number;
    sort?: number;
    remark?: string;
}
export declare class SetMenusDto {
    menuIds: number[];
}
