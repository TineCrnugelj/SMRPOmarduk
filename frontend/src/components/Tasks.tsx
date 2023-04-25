import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "react-bootstrap";
import { getTasksForStory } from "../features/tasks/taskSlice";
import LogTimeModal from "./LogTimeModal";
import Task from "./Task";

interface TasksProps {
    storyId: string
}

const Tasks: React.FC<TasksProps> = ({storyId}) => {
    const dispatch = useAppDispatch();
    const {tasksForStory} = useAppSelector(state => state.tasks);

    useEffect(() => {
        dispatch(getTasksForStory(storyId));
    }, []);

    return (
        <Fragment>
            {tasksForStory.map(task => {
                return <Task task={task} />
            })}
        </Fragment>
    )

    return <h1>asd</h1>
}

export default Tasks;