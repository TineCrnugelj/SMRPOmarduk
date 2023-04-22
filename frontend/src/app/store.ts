import { configureStore } from '@reduxjs/toolkit'

import projectSlice from '../features/projects/projectSlice';
import storySlice from '../features/stories/storySlice';
import userSlice from "../features/users/userSlice";
import sprintSlice from "../features/sprints/sprintSlice";
import projectRoleSlice from '../features/projects/projectRoleSlice';
import taskSlice from '../features/tasks/taskSlice';

export const store = configureStore({
    reducer: {
        users: userSlice,
        projects: projectSlice,
        projectRoles: projectRoleSlice,
        stories: storySlice,
        sprints: sprintSlice,
        tasks: taskSlice
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch