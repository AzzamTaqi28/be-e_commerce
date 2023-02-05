import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTodosDto {
  @IsString()
  @IsOptional()
  todos: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  deadline: Date;
}
