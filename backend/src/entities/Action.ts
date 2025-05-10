import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Zone } from './Zone';
import { User } from './User';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column('jsonb', { nullable: true })
  impactMetrics: {
    before: Record<string, number>;
    after: Record<string, number>;
  };

  @ManyToOne(() => Zone, zone => zone.actions)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column('date', { nullable: true })
  startDate: Date;

  @Column('date', { nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 