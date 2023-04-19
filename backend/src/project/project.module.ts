import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectUserRole } from './project-user-role.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectUserRole,
    ]),
    UserModule
  ],
  controllers: [
    ProjectController,
  ],
  providers: [
    ProjectService,
  ],
  exports: [
    ProjectService,
  ]
})
export class ProjectModule { }
