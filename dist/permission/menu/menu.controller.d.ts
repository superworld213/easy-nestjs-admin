import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    list(): Promise<any[]>;
    create(dto: CreateMenuDto, user: {
        id: number;
    }): Promise<import("../../entities").Menu>;
    update(id: number, dto: UpdateMenuDto, user: {
        id: number;
    }): Promise<import("../../entities").Menu>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
