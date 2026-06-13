import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
export declare class DepartmentController {
    private readonly deptService;
    constructor(deptService: DepartmentService);
    list(): Promise<any[]>;
    create(dto: CreateDepartmentDto): Promise<import("../../entities").Department>;
    update(id: number, dto: UpdateDepartmentDto): Promise<import("../../entities").Department>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
