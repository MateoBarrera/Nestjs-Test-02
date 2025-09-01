import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../../src/modules/task/tasks.controller';
import { TasksService } from '../../src/modules/task/tasks.service';
import { Task, TaskStatus } from '../../src/modules/task/tasks.entity';

describe('TasksController', () => {
    let controller: TasksController;
    let service: any;

    beforeEach(async () => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
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

    it('should call findAll', async () => {
        const items: Task[] = [{ id: 1, title: 'a', description: null, status: TaskStatus.PENDING }];
        service.findAll.mockResolvedValue(items);
        await expect(controller.findAll({ page: 1, limit: 10 } as any)).resolves.toEqual(items);
    });

    it('should call create', async () => {
        const dto = { title: 'x', description: 'd' };
        const saved = { id: 2, ...dto, status: TaskStatus.PENDING } as Task;
        service.create.mockResolvedValue(saved);
        await expect(controller.create(dto as any)).resolves.toEqual(saved);
    });
});
