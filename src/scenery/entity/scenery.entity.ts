import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'scenery' })
export class Scenery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theme: string;

  @Column()
  path: string;

  @Column({ default: 0 })
  status: number;
}
