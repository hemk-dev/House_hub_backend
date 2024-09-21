import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inquiry')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  inquiry_id: string;

  @Column()
  property_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  contact: string;

  @Column('text')
  message: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updated_date: Date;
}
