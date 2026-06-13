import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Menu } from '../../entities/menu.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
export declare class RoleService {
    private readonly roleRepo;
    private readonly menuRepo;
    constructor(roleRepo: Repository<Role>, menuRepo: Repository<Menu>);
    page(query: {
        page?: number;
        pageSize?: number;
        name?: string;
        status?: number;
    }): Promise<{
        list: Role[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateRoleDto, createdBy?: number): Promise<Role>;
    update(id: number, dto: UpdateRoleDto, updatedBy?: number): Promise<Role>;
    delete(id: number): Promise<{
        message: string;
    }>;
    getMenus(roleId: number): Promise<Menu[]>;
    setMenus(roleId: number, menuIds: number[]): Promise<{
        message: string;
    }>;
}
