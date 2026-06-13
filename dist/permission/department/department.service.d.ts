import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
export declare class DepartmentService {
    private readonly deptRepo;
    constructor(deptRepo: Repository<Department>);
    list(): Promise<any[]>;
    create(dto: CreateDepartmentDto): Promise<Department>;
    update(id: number, dto: UpdateDepartmentDto): Promise<Department>;
    delete(id: number): Promise<{
        message: string;
    }>;
    private buildTree;
}
