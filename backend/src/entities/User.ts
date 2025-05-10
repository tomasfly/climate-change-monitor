import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Zone } from './Zone';
import { Action } from './Action';

export enum UserRole {
  ADMIN = 'admin',
  GOVERNMENT = 'government',
  FACTORY = 'factory',
  PUBLIC = 'public'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PUBLIC
  })
  role: UserRole;

  @Column({ nullable: true })
  organization: string;

  @Column({ nullable: true })
  azureId: string;

  @OneToMany(() => Zone, zone => zone.createdBy)
  createdZones: Zone[];

  @OneToMany(() => Action, action => action.createdBy)
  createdActions: Action[];

  @OneToMany(() => Action, action => action.assignedTo)
  assignedActions: Action[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 