import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Story } from './story.entity';
import { ValidationException } from '../common/exception/validation.exception';
import { CreateStoryDto } from './dto/create-story.dto';

@Injectable()
export class StoryService {
  private readonly logger: Logger = new Logger(StoryService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) { }

  async getAllStories(): Promise<Story[]> {
    return await this.storyRepository.find();
  }

  async getStoryById(storyId: number): Promise<Story> {
    return await this.storyRepository.findOneBy({ id: storyId });
  }

  async createStory(story: CreateStoryDto, projectId: number): Promise<object> {
    try {
      let newStory = this.createStoryObject(story, projectId);
      const inserted = await this.storyRepository.insert(newStory);
      return inserted.identifiers[0];
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        switch (ex.driverError.errno) {
          case 1062: // Duplicate entry
            const storyByTitle = await this.getStoryByTitleAndProjectId(story.title, projectId);
            if (storyByTitle != null) {
              throw new ConflictException('Story by this name already exists!');
            }
            throw new ConflictException('Please add a new sequence number for this story.');
        }
      }
    }
  }

  async updateStoryById(storyId, story) {
    try {
      await this.storyRepository.update({ id: storyId }, story);
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        switch (ex.driverError.errno) {
          case 1062: // Duplicate entry
            throw new ValidationException('Storyname already exists');
        }
      }
    }
  }

  async deleteStoryById(storyId: number) {
    await this.storyRepository.delete({ id: storyId });
  }

  async getStoryByTitleAndProjectId(title: string, projectId: number): Promise<Story> {
    return await this.storyRepository.findOneBy({ title: title, projectId: projectId });
  }

  async getStoryBySequenceNumberAndProjectId(sequenceNumber: number, projectId: number): Promise<Story> {
    return await this.storyRepository.findOneBy({ sequenceNumber: sequenceNumber, projectId: projectId });
  }

  async getStoryByTitle(title: string): Promise<Story> {
    return this.storyRepository.findOneBy({ title: title });
  }

  createStoryObject(story: CreateStoryDto, projectId: number): Story {
    let newStory = new Story();
    newStory.projectId = projectId;
    newStory.title = story.title;
    newStory.description = story.description;
    newStory.sequenceNumber = story.sequenceNumber;
    newStory.priority = story.priority;
    newStory.businessValue = story.businessValue;
    return newStory;
  }
}