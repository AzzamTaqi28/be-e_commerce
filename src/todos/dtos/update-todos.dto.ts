import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTodosDto {
  @IsString()
  @IsOptional()
  todos: string;

  @IsNumber()
  @IsOptional()
  status: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  deadline: Date;
}
