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

export enum SensorType {
  TEMPERATURE = 'temperature',
  WATER_QUALITY = 'water_quality',
  AIR_QUALITY = 'air_quality',
  IMAGE = 'image',
  WASTE_LEVEL = 'waste_level'
}

@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SensorType
  })
  type: SensorType;

  @Column('jsonb')
  configuration: {
    unit: string;
    samplingRate: number;
    threshold: number;
    metadata: Record<string, any>;
  };

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Zone, zone => zone.sensors)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column('jsonb', { nullable: true })
  lastReading: {
    value: number;
    timestamp: Date;
    metadata: Record<string, any>;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 