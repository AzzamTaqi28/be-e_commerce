import { MusicsModule } from './musics/musics.module';
import { SceneryModule } from './scenery/scenery.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { Todo } from './todos/entity/todos.entity';
import { Scenery } from './scenery/entity/scenery.entity';
import { Musics } from './musics/entity/musics.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'taqi1625',
      database: 'virtual_cafe',
      entities: [User, Todo, Scenery, Musics],
      synchronize: true,
    }),
    MusicsModule,
    UsersModule,
    AuthModule,
    TodosModule,
    SceneryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
