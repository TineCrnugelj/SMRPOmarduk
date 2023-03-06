import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Test } from '../test/test.entity';

@Entity()
export class Story {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true, unique: true })
  sequenceNumber: number

  @Column({ type: "varchar", length: 200, unique: true })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "tinyint" })
  priority: number;

  @Column({ type: "tinyint" })
  businessValue: number;

  @OneToMany(type => Test, test => test.story)
  tests: Test[];
}