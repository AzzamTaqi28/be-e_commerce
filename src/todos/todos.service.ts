/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entity/todos.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    private usersService: UsersService,
  ) {}

  async create(todo: Object, userId: number) {
    const user = await this.usersService.findById(userId);

    const newTodo = await this.todoRepository.create({
      ...todo,
      user,
    });
    
    const savedTodo = await this.todoRepository.save(newTodo);
    delete savedTodo.user.password;
    return savedTodo;
  }

  async findAll(user: Object, page: number, perpage: number, filter: string) {
    const limit = perpage;
    const offset = perpage * (page - 1);
    const query = await this.todoRepository
      .createQueryBuilder('todos')
      .where('todos.user_id = :userId', { userId: user['userId'] });

    if (filter) {
      query.andWhere('todos.todos LIKE :filter', { filter: `%${filter}%` });
    }

    query.orderBy('todos.deadline', 'ASC');

    const allData = await query.getMany();
    const totalRecord = allData.length;
    const data = await query.limit(limit).offset(offset).getMany();
    const totalShowed = data.length;

    return {
      page,
      totalRecord,
      totalShowed,
      totalPage: Math.ceil(totalRecord / limit),
      showing: `${totalRecord === 0 ? 0 : offset + 1} - ${
        offset + totalShowed
      } of ${totalRecord}`,
      next: offset + totalShowed !== totalRecord,
      data,
    };
  }

  async findOne(user: Object, id: number) {
    return await this.todoRepository
      .createQueryBuilder('todos')
      .where('todos.id = :id', { id })
      .andWhere('todos.user_id = :userId', { userId: user['userId'] })
      .getOne();
  }

  async update(todo: Object, todoId: number, userId: number) {
    return await this.todoRepository
      .createQueryBuilder('todos')
      .update(Todo)
      .set(todo)
      .where('todos.id = :id', { id: todoId })
      .andWhere('todos.user_id = :user_id', { user_id: userId })
      .execute();
  }

  async remove(user: Object, id: number) {
    return await this.todoRepository
      .createQueryBuilder('todos')
      .delete()
      .from(Todo)
      .where('todos.id = :id', { id })
      .andWhere('todos.user_id = :user_id', { user_id: user['userId'] })
      .execute();
  }
}
