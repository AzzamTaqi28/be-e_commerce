import { Musics } from 'src/musics/entity/musics.entity';
import { Todo } from 'src/todos/entity/todos.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;


  // relations
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];


  @OneToMany(() => Musics, (music) => music.user)
  musics: Musics[];
}
