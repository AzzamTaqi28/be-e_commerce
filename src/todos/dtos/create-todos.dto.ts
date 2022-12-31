import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateTodosDto {
  @IsString()
  todos: string;

  @Type(() => Date)
  @IsDate()
  deadline: Date;
}
