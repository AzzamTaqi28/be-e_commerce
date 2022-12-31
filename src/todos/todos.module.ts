import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entity/todos.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UsersModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
