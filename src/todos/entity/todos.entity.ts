import { User } from 'src/users/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  todos: string;

  @Column({ default: 0, type: 'tinyint' })
  status: number;

  @Column()
  deadline: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // relations
  @ManyToOne((type) => User, (user) => user.todos)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
