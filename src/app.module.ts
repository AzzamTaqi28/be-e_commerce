import { MusicsModule } from './musics/musics.module';
import { SceneryModule } from './scenery/scenery.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { Todo } from './todos/entity/todos.entity';
import { Scenery } from './scenery/entity/scenery.entity';
import { Musics } from './musics/entity/musics.entity';
import { typeOrmModuleOptions } from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'taqi1625',
    //   database: 'virtual_cafe',
    //   entities: [User, Todo, Scenery, Musics],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(<string>process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, Todo, Scenery, Musics],
        synchronize: true,
        autoLoadEntities: true,
        // logger: new MyCustomLogger(),
      }),
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
