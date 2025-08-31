import { IsString, IsOptional, IsIn } from 'class-validator';
import { TaskStatus } from './tasks.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  @IsOptional()
  status?: TaskStatus;
}
