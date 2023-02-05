/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodosDto } from './dtos/create-todos.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UpdateTodosDto } from './dtos/update-todos.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private todoService: TodosService) {}

  @Post('create')
  async create(@Body() createTodosDto: CreateTodosDto, @CurrentUser() user: any) {
    return this.todoService.create(createTodosDto, user.userId);
  }
  

  @Get('/:page/:perPage')
  async findAll(
    @CurrentUser() user,
    @Param('page') page: number,
    @Param('perPage') perPage: number,
    @Query('filter') filter: string,
  ) {
    return this.todoService.findAll(user,page, perPage, filter);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number, @CurrentUser() user) {
    return this.todoService.findOne(user, id);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodosDto,
    @CurrentUser() user,
  ) {
    return this.todoService.update(updateTodoDto, id, user.userId);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number, @CurrentUser() user) {
    return this.todoService.remove(user, id);
  }
}
