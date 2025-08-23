import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filePath: string;

  @Column({ default: 'pending' })
  result: string;

  @Column()
  mimetype: string;
}
