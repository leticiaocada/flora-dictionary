import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dictionary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  word: string;
}
