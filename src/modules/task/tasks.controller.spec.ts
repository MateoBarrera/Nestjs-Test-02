import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';

describe('TasksController', () => {
    let controller: TasksController;
    let service: any;

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllWithPagination: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            testModule: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [{ provide: TasksService, useValue: service }],
        }).compile();

        controller = module.get<TasksController>(TasksController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('findAll returns paginated items', async () => {
        const items: Task[] = [{ id: 1, title: 'a', description: null, status: TaskStatus.PENDING }];
        const paginated = { items, meta: { total: 1, page: 1, limit: 10, completed: 0, pending: 1 } };
        service.findAllWithPagination.mockResolvedValue(paginated);
        await expect(controller.findAll(new PaginationDto())).resolves.toEqual(paginated);
    });

    it('create returns created wrapped', async () => {
        const dto = { title: 'x', description: 'd' };
        const saved = { id: 2, ...dto, status: TaskStatus.PENDING } as Task;
        service.create.mockResolvedValue(saved);
        await expect(controller.create(dto as any)).resolves.toEqual({ status: 'success', data: saved });
    });
});
