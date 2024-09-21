import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AvailabilityStatus } from '../enums/property-availability-status.enum';
import { PropertyStatus } from '../enums/property-status.enum';
import { FurnishingStatus } from '../enums/furnishing-status.enum';
import { BHKStatus } from '../enums/bhk-type.enum';
import { User } from './User.entity';

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

  @Column('int', { nullable: true })
  age_of_construction: number;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;
}
