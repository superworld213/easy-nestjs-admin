export declare class CreateUserDto {
    username: string;
    password?: string;
    nickname?: string;
    phone?: string;
    email?: string;
    status?: number;
    remark?: string;
}
export declare class UpdateUserDto {
    nickname?: string;
    phone?: string;
    email?: string;
    status?: number;
    remark?: string;
}
export declare class SetRolesDto {
    roleIds: number[];
}
