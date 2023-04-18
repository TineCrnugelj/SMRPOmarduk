import { BadRequestException, Body, Controller, Delete, Get, ForbiddenException, HttpCode, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ApiBearerAuth, ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminOnly } from '../auth/decorator/admin-only.decorator';
import { CreateProjectDto, CreateProjectSchema } from './dto/create-project.dto';
import { hasNewProjectDevelopers, hasNewProjectProjectOwner, hasNewProjectScrumMaster } from './dto/create-project-user-role.dto';
import { JoiValidationPipe } from '../common/pipe/joi-validation.pipe';
import { Token } from '../auth/decorator/token.decorator';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectUserRole, UserRole } from './project-user-role.entity';
import { ValidationException } from '../common/exception/validation.exception';
import { AdminOnlyGuard } from '../auth/guard/admin-only.guard';
import { UserService } from '../user/user.service';
import { TokenDto, tokenSchema } from '../auth/dto/token.dto';
import { UpdateProjectSchema, UpdateProjectDto } from './dto/update-project.dto';
import { UpdateSuperiorUser, UpdateSuperiorUserSchema } from './dto/edit-user-role.dto';
import { ProjectDto } from './dto/project.dto';

@ApiTags('project')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard('jwt'), AdminOnlyGuard)
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) { }

  @ApiOperation({ summary: 'List projects.' })
  @ApiOkResponse()
  @Get()
  async listProjects(): Promise<Project[]> {
    return await this.projectService.getAllProjects();
  }

  @ApiOperation({ summary: 'List projects with user data.' })
  @ApiOkResponse()
  @Get('/withData')
  async listProjectsAndUserData(): Promise<ProjectDto[]> {
    return await this.projectService.getAllProjectsWithUserData();
  }

  @ApiOperation({ summary: 'Get project by ID.' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':projectId')
  async getProject(@Param('projectId', ParseIntPipe) projectId: number): Promise<Project> {
    const project = await this.projectService.getProjectById(projectId);
    if (!project)
      throw new NotFoundException('Project not found');
    return project;
  }

  @ApiOperation({ summary: 'Create project.' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @AdminOnly()
  @Post()
  async createProject(@Body(new JoiValidationPipe(CreateProjectSchema)) project: CreateProjectDto) {
    try {
      // Check if only one member is product owner and if this member does not have any other roles.
      if (!hasNewProjectProjectOwner(project.userRoles)) {
        throw new BadRequestException('There should only be one product owner, which cannot be anything else.');
      }

      // Check if there are all required roles.
      if (!hasNewProjectScrumMaster(project.userRoles) || !hasNewProjectDevelopers(project.userRoles)) {
        throw new BadRequestException('All roles must be included in the project, only one scrum master.');
      }

      // Check if user actually exist in the database.
      for (const userRole of project.userRoles) {
        const user = await this.userService.getUserById(userRole.userId);
        if (user == null)
          throw new NotFoundException(`One of users not found in the database.`);
      }
      const row = await this.projectService.createProject(project);
      const projectId = (<any>row).id;
      for (const userRole of project.userRoles)
        for (const role of userRole.role)
          await this.projectService.addDeveloperToProject(projectId, userRole.userId, role);
    } catch (ex) {
      if (ex instanceof ValidationException)
        throw new BadRequestException(ex.message);
      throw ex;
    }
  }

  @ApiOperation({ summary: "Update project name and description." })
  @ApiOkResponse()
  @Patch(':projectId')
  async updateProject(@Token() token, @Param('projectId', ParseIntPipe) projectId: number, @Body(new JoiValidationPipe(UpdateProjectSchema)) project: UpdateProjectDto) {
    try {

      if (!token.isAdmin && !await this.projectService.hasUserRoleOnProject(projectId, token.sid, UserRole.ScrumMaster)) {
        throw new ForbiddenException('User must be either an administrator or a scrum master to have any permission.');
      }

      let existingProject: Project = await this.projectService.getProjectById(projectId);
      if (existingProject == null) {
        throw new NotFoundException('Project with the given ID not found.');
      }

      existingProject.projectName = project.projectName;
      existingProject.projectDescription = project.projectDescription == null ? existingProject.projectDescription : project.projectDescription;

      await this.projectService.updateProjectById(projectId, existingProject);
    }
    catch (ex) {
      if (ex instanceof ConflictException) {
        throw new ConflictException(ex.message);
      }
      else if (ex instanceof NotFoundException) {
        throw new NotFoundException(ex.message);
      }
      else {
        throw new BadRequestException(ex.message);
      }
    }
  }

  @ApiOperation({ summary: 'Update the scrum master / product owner.' })
  @ApiOkResponse()
  @Patch(':projectId/change-user/role/:role')
  async changeProjectOwner(@Token() token, @Param('projectId', ParseIntPipe) projectId: number, @Param('role', ParseIntPipe) role: number, @Body(new JoiValidationPipe(UpdateSuperiorUserSchema)) newUser: UpdateSuperiorUser) {
    if (!token.isAdmin) {
      throw new ForbiddenException('Only the administrator can change the project owner or the scrum master.');
    }

    if (role != UserRole.ScrumMaster && role != UserRole.ProjectOwner) {
      throw new BadRequestException('Only the scrum master and the product owner can be changed.');
    }

    await this.projectService.overwriteUserRoleOnProject(projectId, newUser.newUserId, role);
  }

  @ApiOperation({ summary: 'Delete project.' })
  @ApiOkResponse()
  @AdminOnly()
  @Delete(':projectId')
  async deleteProject(@Param('projectId', ParseIntPipe) projectId: number) {
    await this.projectService.deleteProjectById(projectId);
  }

  @ApiOperation({ summary: 'List users with roles on the project.' })
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @Get(':projectId/user')
  async listUsersRolesOnProject(
    @Token() token: TokenDto,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<ProjectUserRole[]> {
    // Check permissions
    if (!token.isAdmin && !await this.projectService.isUserOnProject(projectId, token.sid))
      throw new ForbiddenException('Only the admin or the user on a project can view the project members.');
    return await this.projectService.listUsersWithRolesOnProject(projectId);
  }

  @ApiOperation({ summary: 'List users with role on the project.' })
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @Get(':projectId/user/role/:role')
  async listUsersWithRoleOnProject(
    @Token() token: TokenDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('role', ParseIntPipe) role: number,
  ): Promise<ProjectUserRole[]> {
    // Check permissions
    if (!token.isAdmin && !await this.projectService.isUserOnProject(projectId, token.sid))
      throw new ForbiddenException();
    return await this.projectService.listUsersWithRoleOnProject(projectId, role);
  }

  @ApiOperation({ summary: 'Add user to project.' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @HttpCode(200)
  @Post(':projectId/add-developer/:userId')
  async addDeveloperToProject(
    @Token() token: TokenDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {

    if (!token.isAdmin && !await this.projectService.hasUserRoleOnProject(projectId, token.sid, UserRole.ScrumMaster))
      throw new ForbiddenException('Only the administrator and the scrum master are allowed to add the developer.');

    // Get every user on the project and remove the project owner.
    let allUsersOnProject: ProjectUserRole[] = (await this.projectService.listUsersWithRolesOnProject(projectId));

    // Check if we would like to add the dev role to the product owner.
    if (allUsersOnProject.filter(po => po.role == UserRole.ProjectOwner && po.userId == userId).length == 1)
      throw new BadRequestException('Product owner cannot also be a developer.');

    // Check if Scrum master already has a developer role.
    let scrumMaster: ProjectUserRole = allUsersOnProject.filter(sc => sc.role == UserRole.ScrumMaster)[0];

    if (allUsersOnProject.filter(usersRoles => usersRoles.userId == scrumMaster.userId).length == 2)
      throw new BadRequestException('The scrum master is already a developer.');

    // Check if the target user already has the developer role.
    if (allUsersOnProject.filter(dev => dev.role == UserRole.Developer && dev.userId == userId).length == 1)
      throw new BadRequestException('The user is already a developer.');

    try {
      await this.projectService.addDeveloperToProject(projectId, userId, UserRole.Developer);
    } catch (ex) {
      if (ex instanceof ValidationException)
        throw new BadRequestException(ex.message);
      throw ex;
    }
  }

  @ApiOperation({ summary: 'Remove developer from project.' })
  @ApiOkResponse()
  @Delete(':projectId/remove-developer/:userId')
  async removeDeveloperFromProject(
    @Token() token: TokenDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {

    // Check permissions
    if (!token.isAdmin && !await this.projectService.hasUserRoleOnProject(projectId, token.sid, UserRole.ScrumMaster))
      throw new ForbiddenException('Only the administrator and the scrum master are allowed to remove the developer.');

    let developers: ProjectUserRole[] = await this.projectService.listUsersWithRoleOnProject(projectId, UserRole.Developer);

    // Check if developer count in the project. 
    if (developers.length == 1)
      throw new BadRequestException('You cannot remove the only developer on a project.');

    if (developers.filter(dev => dev.userId == userId).length == 0)
      throw new BadRequestException('The user is not developer. Try again with a new user.');

    await this.projectService.removeRoleFromUserOnProject(projectId, userId, UserRole.Developer);
  }
}
