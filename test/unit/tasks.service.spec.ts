import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from '../../src/modules/task/tasks.service';
import { Task, TaskStatus } from '../../src/modules/task/tasks.entity';

import { CreateTaskDto } from '../../src/modules/task/dto/createTask.dto';
import { UpdateTaskDto } from '../../src/modules/task/dto/updateTask.dto';

// Keep mocks typed as any to avoid strict TS issues in tests
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

    describe('findAll', () => {
        it('returns all tasks', async () => {
            const tasks: Task[] = [
                { id: 1, title: 'A', description: null, status: TaskStatus.PENDING },
            ];
            repo.find.mockResolvedValue(tasks);
            await expect(service.findAll()).resolves.toEqual(tasks);
            expect(repo.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('returns a task when found', async () => {
            const task = { id: 1, title: 'A', description: null, status: TaskStatus.PENDING } as Task;
            repo.findOneBy.mockResolvedValue(task);
            await expect(service.findOne(1)).resolves.toEqual(task);
            expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('create', () => {
        it('creates and returns a task', async () => {
            const dto: CreateTaskDto = { title: 'New', description: 'desc' };
            const saved = { id: 10, title: 'New', description: 'desc', status: TaskStatus.PENDING } as Task;
            repo.save.mockResolvedValue(saved);
            await expect(service.create(dto)).resolves.toEqual(saved);
            expect(repo.save).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('calls repository.update', async () => {
            const dto: UpdateTaskDto = { title: 'Updated' };
            repo.update.mockResolvedValue(undefined);
            await expect(service.update(1, dto)).resolves.toBeUndefined();
            expect(repo.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('calls repository.delete', async () => {
            repo.delete.mockResolvedValue(undefined);
            await expect(service.remove(1)).resolves.toBeUndefined();
            expect(repo.delete).toHaveBeenCalledWith(1);
        });
    });
});
