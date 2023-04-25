import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllTasks } from "../features/tasks/taskSlice";
import { Button } from "react-bootstrap";
import LogTimeModal from "./LogTimeModal";

interface TasksProps {
    storyId: string
}

const Tasks: React.FC<TasksProps> = ({storyId}) => {
    const dispatch = useAppDispatch();
    const {tasks} = useAppSelector(state => state.tasks);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(getAllTasks(storyId));
    }, []);

    const openLogTimeModal = () => {
        setShowModal(true);
    }

    const hideModal = () => {
        setShowModal(false);
      }

    return (
        <Fragment>
            {tasks.map(task => {
                return (
                    <tr key={task.id}>
                        <td >{task.id}</td>
                        <td >{task.title}</td>
                        <td ><Button className="align-middle text-decoration-none" variant="link">{task.status}</Button></td>
                        
                        <td >{task.workedTime}</td>
                        <td >{task.remainingTime}</td>
                        <td >{task.estimatedTime}</td>
                        <td ><Button variant="outline-primary" size="sm" onClick={openLogTimeModal}>Work History</Button></td>
                    </tr>
                )
            })}
            {showModal && <LogTimeModal showModal={showModal} hideModal={hideModal} />}
        </Fragment>
    )

    return <h1>asd</h1>
}

export default Tasks;
