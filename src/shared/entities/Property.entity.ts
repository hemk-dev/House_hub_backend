import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AvailabilityStatus } from '../enums/property-availability-status.enum';
import { PropertyStatus } from '../enums/property-status.enum';
import { FurnishingStatus } from '../enums/furnishing-status.enum';
import { BHKStatus } from '../enums/bhk-type.enum';
import { User } from './User.entity';
import { tenantPreferred } from '../enums/tenant-preferred.enum';
import { Inquiry } from './Inquiry.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('uuid', { name: 'user_id' })
  userId: string | null;

  @Column({
    type: 'enum',
    enum: AvailabilityStatus,
    default: AvailabilityStatus.IMMEDIATELY,
  })
  availability_status: AvailabilityStatus;

  @Column('decimal')
  security_deposit: number;

  @Column('decimal')
  rent: number;

  @Column()
  owner_name: string;

  @Column('text', { nullable: true })
  Buyer_name: string;

  @Column()
  contact: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  zipcode: string;

  @Column()
  email: string;

  @Column('decimal', { nullable: true })
  carpet_area: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.VACANT,
  })
  status: PropertyStatus;

  @Column({
    type: 'enum',
    enum: FurnishingStatus,
    default: FurnishingStatus.UNFURNISHED,
  })
  furnishing: FurnishingStatus;

  @Column('text', { array: true, nullable: true })
  photos: string[];

  @Column({
    type: 'enum',
    enum: BHKStatus,
    default: BHKStatus.ONE_BHK,
  })
  BHK: BHKStatus;

  @Column({
    type: 'enum',
    enum: tenantPreferred,
    default: tenantPreferred.Both,
  })
  tenantPreferred: tenantPreferred;

  @Column('int', { name: 'bathroom', default: 1 })
  bathroom: number;

  @Column('int', { nullable: true })
  age_of_construction: number;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;

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

  @OneToMany(() => Inquiry, (inquiry) => inquiry.property) // Create a one-to-many relationship
  inquiries: Inquiry[];
}
