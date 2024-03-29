import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { ProjectWallNotificationComment } from '../project-wall-notification-comment/comment.entity';

@Entity()
export class ProjectWallNotification {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 200 })
  author: string;

  @Column({ length: 200 })
  title: string;

  @Column({ unsigned: true, type: 'int' })
  projectId: number;

  @Column({ unsigned: true, type: 'int' })
  userId: number;

  @ManyToOne(type => Project, project => project.wallNotifications, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  project: Project;

  @Column({ type: 'text' })
  postContent: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created: string;

  @OneToMany(type => ProjectWallNotificationComment, comment => comment.projectWallNotification)
  comments: ProjectWallNotificationComment[];

  @ManyToOne(type => User, user => user.projectWallNotifications)
  user: User;
}
