import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-roles.enum';

@Entity('user-demo')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column('character varying', {
    name: 'first_name',
  })
  firstName: string;

  @Column('character varying', {
    name: 'last_name',
  })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    name: 'role_id',
  })
  roleId: UserRole;

  @Column({ nullable: true })
  otp: string;

  @Column({ name: 'otp_used', type: 'boolean', default: false })
  otpUsed: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
