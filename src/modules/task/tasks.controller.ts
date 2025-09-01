import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService, PaginatedTasks } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { TaskStatus } from './tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const created = await this.tasksService.create(createTaskDto);
    return { status: 'success', data: created };
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: TaskStatus,
  ): Promise<PaginatedTasks> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    return this.tasksService.findAllWithPagination(status as TaskStatus, page, limit);
  }

  @Get('test')
  test() {
    return this.tasksService.testModule();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.tasksService.findOne(+id);
    if (!item) {
      return { status: 'error', message: 'Not found' };
    }
    return { status: 'success', data: item };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const updated = await this.tasksService.update(+id, updateTaskDto);
    if (!updated) {
      return { status: 'error', message: 'Not found' };
    }
    return { status: 'success', data: updated };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const ok = await this.tasksService.remove(+id);
    if (!ok) {
      return { status: 'error', message: 'Not found' };
    }
    return null;
  }
}
