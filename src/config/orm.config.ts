import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '../users/entity/user.entity';
import { Todo } from '../todos/entity/todos.entity';
import { Scenery } from '../scenery/entity/scenery.entity';
import { Musics } from '../musics/entity/musics.entity';


export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(<string>process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Todo, Scenery, Musics],
  /* Note : it is unsafe to use synchronize: true for schema synchronization
  on production once you get data in your database. */
  synchronize: false,
  autoLoadEntities: true,
  // logger: new MyCustomLogger(),
};
// type: 'mysql',
//     //   host: 'localhost',
//     //   port: 3306,
//     //   username: 'root',
//     //   password: 'taqi1625',
//     //   database: 'virtual_cafe',
//     //   entities: [User, Todo, Scenery, Musics],
//     //   synchronize: true,

// export const OrmConfig = {
//   ...typeOrmModuleOptions,
//   migrationsTableName: 'migrations',
//   migrations: ['src/migrations/*.ts'],
//   cli: {
//     migrationsDir: 'src/migrations',
//   },
// };
// export default OrmConfig;
