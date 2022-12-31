import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'musics' })
export class Musics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  artist: string;

  @Column()
  path: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'created_by' })
  createdBy: number;

  @Column({ default: false, name: 'by_admin' })
  byAdmin: boolean;

  // relations
  @ManyToOne((type) => User, (user) => user.musics)
  @JoinColumn({ name: 'created_by' })
  user: User;
}
