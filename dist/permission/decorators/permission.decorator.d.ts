export declare const PERMISSION_KEY = "permission";
export interface PermissionOptions {
    code: string | string[];
    operation?: 'and' | 'or';
}
export declare const Permission: (code: string | string[], operation?: "and" | "or") => import("@nestjs/common").CustomDecorator<string>;
