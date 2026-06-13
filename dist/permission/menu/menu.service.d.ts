import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
export declare class MenuService {
    private readonly menuRepo;
    constructor(menuRepo: Repository<Menu>);
    list(): Promise<any[]>;
    create(dto: CreateMenuDto, createdBy?: number): Promise<Menu>;
    update(id: number, dto: UpdateMenuDto, updatedBy?: number): Promise<Menu>;
    delete(id: number): Promise<{
        message: string;
    }>;
    private buildTree;
}
