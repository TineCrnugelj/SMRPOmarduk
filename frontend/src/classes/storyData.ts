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
    isRealized: boolean
}
export enum SprintBacklogItemStatus {
    UNALLOCATED = 'Unallocated',
    ALLOCATED = 'Allocated',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
  }

export enum ProductBacklogItemStatus {
    WONTHAVE = "Won't have this time",
    UNALLOCATED = 'Unallocated',
    ALLOCATED = 'Allocated',
    DONE = 'Done',
}

export interface UpdateStoryCategory {
    id?:       string,
    category: number,
    projectId: number,
}

