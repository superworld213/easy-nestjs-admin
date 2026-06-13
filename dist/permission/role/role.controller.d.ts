import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, SetMenusDto } from './dto/role.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    page(page?: number, pageSize?: number, name?: string, status?: number): Promise<{
        list: import("../../entities").Role[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateRoleDto, user: {
        id: number;
    }): Promise<import("../../entities").Role>;
    update(id: number, dto: UpdateRoleDto, user: {
        id: number;
    }): Promise<import("../../entities").Role>;
    delete(id: number): Promise<{
        message: string;
    }>;
    getMenus(id: number): Promise<import("../../entities").Menu[]>;
    setMenus(id: number, dto: SetMenusDto): Promise<{
        message: string;
    }>;
}
