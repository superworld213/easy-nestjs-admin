import { PositionService } from './position.service';
import { CreatePositionDto, UpdatePositionDto, SetDataPermissionDto } from './dto/position.dto';
export declare class PositionController {
    private readonly posService;
    constructor(posService: PositionService);
    page(page?: number, pageSize?: number, name?: string, dept_id?: number): Promise<{
        list: import("../../entities").Position[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreatePositionDto): Promise<import("../../entities").Position>;
    update(id: number, dto: UpdatePositionDto): Promise<import("../../entities").Position>;
    delete(id: number): Promise<{
        message: string;
    }>;
    getDataPermission(id: number): Promise<import("../../entities").DataPermissionPolicy | null>;
    setDataPermission(id: number, dto: SetDataPermissionDto): Promise<import("../../entities").DataPermissionPolicy>;
}
