import { Repository } from 'typeorm';
import { Position } from '../../entities/position.entity';
import { DataPermissionPolicy } from '../../entities/data-permission-policy.entity';
import { CreatePositionDto, UpdatePositionDto, SetDataPermissionDto } from './dto/position.dto';
export declare class PositionService {
    private readonly posRepo;
    private readonly policyRepo;
    constructor(posRepo: Repository<Position>, policyRepo: Repository<DataPermissionPolicy>);
    page(query: {
        page?: number;
        pageSize?: number;
        name?: string;
        dept_id?: number;
    }): Promise<{
        list: Position[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreatePositionDto): Promise<Position>;
    update(id: number, dto: UpdatePositionDto): Promise<Position>;
    delete(id: number): Promise<{
        message: string;
    }>;
    getDataPermission(positionId: number): Promise<DataPermissionPolicy | null>;
    setDataPermission(positionId: number, dto: SetDataPermissionDto): Promise<DataPermissionPolicy>;
}
