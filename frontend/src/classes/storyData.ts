export interface Test {
    id: string,
    description: string,
    storyId: string,
    isRealized: boolean
}

export interface StoryData {
    id?:       string,
    title:  string,
    description:  string,
    tests: string[],
    priority:  number,
    businessValue:     number,
    sequenceNumber: number,
    projectID?: any,
    userId?: number,
    category: number
    timeComplexity: number,
    isRealized: boolean,
    tasks: any[]
}

export interface StoryDataOfProject {
    id?:       string,
    title:  string,
    description:  string,
    tests: Test[],
    priority:  number,
    businessValue:     number,
    sequenceNumber: number,
    projectID?: any,
    userId?: number,
    isRealized: boolean,
}

export enum SprintBacklogItemStatus {
    UNALLOCATED = 'Unallocated',
    ALLOCATED = 'Allocated',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
  }

export enum ProductBacklogItemStatus {
    WONTHAVE = "Won't have this time",
    UNALLOCATED = 'Unassigned',
    ALLOCATED = 'Sprint Backlog',
    DONE = 'Finished',
}

export interface UpdateStoryCategory {
    id?:       string,
    category: number,
    projectId: number,
    storyId: string
}

export interface UpdateTimeComplexity {
    id?:       string,
    timeComplexity: number
    storyId: string
}


export interface RejectStory {
    id?:       string,
    description: string
    storyId: string
}

export interface NotificationData {
    id?:       string,
    description: string,
    storyId: string,
    authorName?: string,
    created?: string
}

export interface PostDataNotification {
    authorName: string
    id?: string,
    userId?: string,
    storyId?: string,
    notificationText: string,
    notificationType: number,
    created?: string,
    approved: boolean
}



