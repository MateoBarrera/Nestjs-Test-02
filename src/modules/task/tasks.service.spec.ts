import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

const createMockRepository = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', () => {
    let service: TasksService;
    let repo: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: getRepositoryToken(Task), useValue: createMockRepository() },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        repo = module.get<any>(getRepositoryToken(Task));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll returns tasks', async () => {
        const tasks: Task[] = [{ id: 1, title: 'A', description: null, status: TaskStatus.PENDING }];
        repo.find.mockResolvedValue(tasks);
        await expect(service.findAll()).resolves.toEqual(tasks);
    });

    it('findOne returns task', async () => {
        const task = { id: 1, title: 'A', description: null, status: TaskStatus.PENDING } as Task;
        repo.findOneBy.mockResolvedValue(task);
        await expect(service.findOne(1)).resolves.toEqual(task);
    });

    it('create saves task', async () => {
        const dto: CreateTaskDto = { title: 'New', description: 'desc' };
        const saved = { id: 10, title: 'New', description: 'desc', status: TaskStatus.PENDING } as Task;
        repo.save.mockResolvedValue(saved);
        await expect(service.create(dto)).resolves.toEqual(saved);
    });

    it('update calls repo.update', async () => {
        const dto: UpdateTaskDto = { title: 'Updated' };
        const updated = { id: 1, title: 'Updated', description: null, status: TaskStatus.PENDING } as Task;
        repo.update.mockResolvedValue(undefined);
        repo.findOneBy.mockResolvedValue(updated);
        await expect(service.update(1, dto)).resolves.toEqual(updated);
    });

    it('remove calls repo.delete', async () => {
        repo.delete.mockResolvedValue({ affected: 1 });
        await expect(service.remove(1)).resolves.toBe(true);
    });
});
