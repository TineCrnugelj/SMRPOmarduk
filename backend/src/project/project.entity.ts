import { Member } from 'src/member/member.entity';
import { Story } from 'src/story/story.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 128, unique: true })
  projectname: string;
 
  @OneToMany(type => Member, member => member.project)
  members: Member[];

  @OneToMany(type => Story, story => story.project)
  stories: Story[];
}

