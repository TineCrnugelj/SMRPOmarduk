export interface SprintData {
    name: string,
    velocity: number,
}

export interface SprintBody {
    projectId: string,
    id?: string,
    name: string,
    velocity: number,
    startDate: string,
    endDate: string,
}

export interface DateRangeSpecs {
    startDate: Date,
    endDate: Date,
    key: string,
    selection?: any
}

export interface StorySprint {
    sprintId: number,
    storyId: number
}