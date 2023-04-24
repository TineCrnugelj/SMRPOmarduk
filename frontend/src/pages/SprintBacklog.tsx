import React, { Component, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DragDropContextProps,
} from "@hello-pangea/dnd";
import { v4 as uuid } from "uuid";
<<<<<<< HEAD
import { Button, Card, CloseButton, Col, Dropdown, Form, InputGroup, ListGroup, Modal, Nav, ProgressBar, Row, Tab, Table, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
=======
import {
  Button,
  Card,
  CloseButton,
  Col,
  Dropdown,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Nav,
  ProgressBar,
  Row,
  Tab,
  Table,
} from "react-bootstrap";
>>>>>>> 58a5c0c159f8cd0489f9d6ecb5540bfebdade31d
import {
  CircleFill,
  Clock,
  Pencil,
  ThreeDots,
  Trash,
  Stack,
  ConeStriped,
  X,
  Person,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { StoryData, SprintBacklogItemStatus } from "../classes/storyData";

import produce from "immer";
import DeleteConfirmation from "./DeleteConfirmation";
import { getAllStory, deleteStory } from "../features/stories/storySlice";
import classes from "./Dashboard.module.css";
import StoryModal from "./StoryModal";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import { parseJwt } from "../helpers/helpers";
import TaskModal from "./TaskModal";
import TaskForm from "../components/TaskForm";
import EditTaskForm from "../components/EditTaskForm";
import DeleteTaskModal from "../components/DeleteTaskModal";
import AssignUserForm from "../components/AssignUserForm";

//const token = JSON.parse(localStorage.getItem('user')!).token;

//StoryData
//installed packages:
//npm install @hello-pangea/dnd --save
//npm install uuidv4
//npm install react-bootstrap-icons --save
//npm install --save react-bootstrap
//npm install bootstrap --save

/*

const itemsFromBackend123 = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" },
  { id: uuid(), content: "Third task" },
  { id: uuid(), content: "Fourth task" },
  { id: uuid(), content: "Fifth task" },
];




    

const columnsFromBackend = {
  [uuid()]: {
    name: "Requested",
    items: []
  },
  [uuid()]: {
    name: "To do",
    items: [],
  },
  [uuid()]: {
    name: "In Progress",
    items: [],
  },
  [uuid()]: {
    name: "Done",
    items: [],
  },
};
  

  

*/







function SprintBacklog() {
  const dispatch = useAppDispatch();

  //demo
  const initialList = [
    {
      id: 1,
      title: "title1",
      status: "asigned",
      user: "matevz",
      workedTime: 3,
      remainingTime: 2,
      estimatedTime: 6,
    },
    {
      id: 2,
      title: "title2",
      status: "unasigned",
      user: "janez",
      workedTime: 4,
      remainingTime: 1,
      estimatedTime: 5,
    },
  ];
  const [list, setList] = useState(initialList);
  function handleChange() {
    // track input field's state
  }

  const handleAdd = (e: any) => {
    e.preventDefault();
  };

  let { users, user } = useAppSelector((state) => state.users);
  const [allUsers, setAllUsers] = useState<String[]>([]);

  useEffect(() => {
    if (!(users.length === 0)) {
      const usernames = users.map((user) => user.username);
      setAllUsers(usernames);
    }
  }, [users]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (user === null) {
      return;
    }
    const token = JSON.parse(localStorage.getItem("user")!).token;
    const userData = parseJwt(token);
    setIsAdmin(userData.isAdmin);
    setUserName(userData.sub);
  }, [user]);

  useEffect(() => {
    dispatch(getAllStory());
  }, []);

  //let stories = useAppSelector((state) => state.stories);
  //console.log(stories)
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      console.log("redirect");
      navigate("/login");
    }
  }, [user]);

  let { stories, isSuccess } = useAppSelector((state) => state.stories);

  const [itemsByStatus, setItemsByStatus] = useState<StoryData[]>([]);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);

  // this is needed for add task modal
  const [selectedStoryId, setSelectedStoryId] = useState("");

  const openAddTaskModal = (id: string) => {
    setSelectedStoryId(id);
    setShowAddTaskModal(true);
  };

  const openEditTaskModal = (item: any) => {
    setShowEditTaskModal(true);
  };

  const openDeleteTaskModal = (item: any) => {
    setShowDeleteTaskModal(true);
  };

  const openAssignUserModal = (item: any) => {
    setShowAssignUserModal(true);
  };

  const hideAddTaskModal = () => {
    setShowAddTaskModal(false);
  };

  const hideEditTaskModal = () => {
    setShowEditTaskModal(false);
  };

  const hideDeleteTaskModal = () => {
    setShowEditTaskModal(false);
  };

  const hideAssignTaskModal = () => {
    setShowEditTaskModal(false);
  };

  const stringPriority = (priority: number): string[] => {
    switch (priority) {
      case 0:
        return ["Must have", "badge-light-must"];
      case 1:
        return ["Could have", "badge-light-could"];
      case 2:
        return ["Should have", "badge-light-should"];
      case 3:
        return ["Won't have this time", "gray-wont"];
      default:
        return [];
    }
  };

  //doda začetne elemnte

  useEffect(() => {
    //console.log(SprintBacklogItemStatus)
    //console.log(itemsByStatus)

    const isEmpty = Object.values(itemsByStatus).every((value) => value);
    if (isEmpty && isSuccess) {
      setItemsByStatus(stories);
    }
  }, [isSuccess]);

  //{Object.values.map(([columnId, column], index) => {

  const initvalue: StoryData = {
    id: "",
    title: "",
    description: "",
    tests: [],
    priority: 0,
    businessValue: 0,
    sequenceNumber: 0,
    category: 0,
    timeComplexity: 0,
    isRealized: false,
  };

  //modal za form
  const [showForm, setShowForm] = useState(false);
  const [tempDataStory, setTempDataTask] = useState<StoryData>(initvalue);
  const getDataTask = (item: StoryData) => {
    setTempDataTask(item);
    //console.log(item);
    return setShowForm(true);
  };

  //onClick={() => getDataStory(item)}

  return (
    <>
    <div className="row flex-row flex-sm-nowrap m-1 mt-3 justify-content-center">
    
    <div className="col-sm-10 col-md-8 col-xl-6 mt-3">
      <div className="d-flex justify-content-end">
      <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
        <ToggleButton  variant="outline-primary" id="tbg-radio-1" value={1}>
          Unallocated
        </ToggleButton>
        <ToggleButton  variant="outline-primary" id="tbg-radio-2" value={2}>
          Allocated
        </ToggleButton>
        <ToggleButton  variant="outline-primary" id="tbg-radio-3" value={3}>
          Active
        </ToggleButton>
        <ToggleButton  variant="outline-primary" id="tbg-radio-4" value={4}>
          Closed
        </ToggleButton>
      </ToggleButtonGroup>

      </div>
    {Object.values(itemsByStatus).map((item) => {
            //console.log(item)

            return (
              <Card className="mt-3">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <Card.Header className="d-flex align-items-center">
                    <Nav variant="tabs" defaultActiveKey="first">
                      <Nav.Item>
                        <Nav.Link eventKey="first">Details</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">Comments</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <Card.Body>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>

                        <Table
                          responsive="lg"
                          className={` ${classes["gfg"]} small`}
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Title</th>
                              <th>Status</th>
                              <th>User</th>
                              <th>workedTime</th>
                              <th>Remaining time</th>
                              <th>Estimated time</th>
                            </tr>
                          </thead>

                          <tbody>
                            {list.map((item) => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.status}</td>
                                <td>{item.user}</td>
                                <td>{item.workedTime}</td>
                                <td>{item.remainingTime}</td>
                                <td>{item.estimatedTime}</td>
                                <td>
                                  <Dropdown className="ms-auto">
                                    <Dropdown.Toggle
                                      variant="link"
                                      id="dropdown-custom-components"
                                      bsPrefix="p-0"
                                    >
                                      <ThreeDots />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={() => openEditTaskModal(item)}
                                      >
                                        <Pencil /> Edit
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          openAssignUserModal(item)
                                        }
                                      >
                                        <Person /> Assign User
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          openDeleteTaskModal(item)
                                        }
                                      >
                                        <Trash /> Delete
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </td>
                              </tr>
                            ))}

      {list.map((item) => (
        <tr key={item.id}>
          <td >{item.id}</td>
          <td >{item.title}</td>
          <td >{item.status}</td>
          <td >{item.user}</td>
          <td >{item.workedTime}</td>
          <td >{item.remainingTime}</td>
          <td >{item.estimatedTime}</td>
        </tr>
      ))}
      
  
      
                             <tr className="align-middle">
                              <th>
                                <Button
                                  form="my_form"
                                  size="sm"
                                  type="button"
                                  onClick={handleAdd}
                                >
                                  Add
                                </Button>
                              </th>
                              <th>
                                <Form.Control
                                  form="my_form"
                                  size="sm"
                                  placeholder="Title"
                                />
                              </th>
                              <th>Status</th>
                              <th>
                                <Form.Select
                                  form="my_form"
                                  size="sm"
                                  defaultValue="Choose..."
                                >
                                  <option>/</option>
                                  {allUsers.map((user) => (
                                    <option key={allUsers.indexOf(user)}>
                                      {user}
                                    </option>
                                  ))}
                                </Form.Select>
                              </th>
                              <th>/</th>
                              <th>/</th>
                              <th>
                                <Form.Control
                                  form="my_form"
                                  size="sm"
                                  placeholder="Title"
                                />
                              </th>
                            </tr> 
                          </tbody>
                        </Table>

                        <Button
                          form="my_form"
                          size="sm"
                          type="button"
                          onClick={() => openAddTaskModal(item.id!)}
                        >
                          Add new task
                        </Button>
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">dfvdf</Tab.Pane>
                    </Tab.Content>
                  </Card.Body>
                </Tab.Container>
              </Card>
            );
          })}
        </div>
      </div>

      {showForm && (
        <TaskModal
          item={tempDataStory}
          onCancel={() => setShowForm(false)}
          show={showForm}
        />
      )}

      {/* TODO 14 15 */}
      {showAddTaskModal && (
        <TaskForm
          storyId={+selectedStoryId}
          descriptionInit=""
          timeRequiredInit=""
          assignedUserIdInit=""
          closeModal={hideAddTaskModal}
          showModal={showAddTaskModal}
        />
      )}

      {showEditTaskModal && (
        <EditTaskForm
          id="1"
          descriptionInit="Prepare UI"
          timeRequiredInit="1"
        />
      )}

      {showAssignUserModal && <AssignUserForm id={"2"} assignedUserIdInit="" />}

      {showDeleteTaskModal && <DeleteTaskModal id={"1"} />}
    </>
  );
}

export default SprintBacklog;
