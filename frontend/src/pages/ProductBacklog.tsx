import React, { Component, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DragDropContextProps,
} from "@hello-pangea/dnd";
import { v4 as uuid } from "uuid";
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
} from "react-bootstrap";
import {
  CircleFill,
  Clock,
  Pencil,
  ThreeDots,
  Trash,
  Stack,
  ConeStriped,
  X,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { StoryData, ProductBacklogItemStatus } from "../classes/storyData";

import produce from "immer";
import DeleteConfirmation from "./DeleteConfirmation";
import {
  getAllStory,
  deleteStory,
  reset,
} from "../features/stories/storySlice";
import classes from "./Dashboard.module.css";
import StoryModal from "./StoryModal";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";

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

const defaultItems = {
  [ProductBacklogItemStatus.UNALLOCATED]: [],
  [ProductBacklogItemStatus.ALLOCATED]: [],
  [ProductBacklogItemStatus.DONE]: [],
};

type TaskboardData = Record<ProductBacklogItemStatus, StoryData[]>;

function Dashboard() {
  const dispatch = useAppDispatch();
  let storyState = useAppSelector((state) => state.stories);

  useEffect(() => {
    dispatch(getAllStory());
  }, []);

  // NOTE: temporary fix, change this if needed
  useEffect(() => {
    if (storyState.isSuccess && !storyState.isLoading) {
      dispatch(reset());
    }
    if (storyState.isError && !storyState.isLoading) {
      dispatch(reset());
    }
  }, [storyState.isSuccess, storyState.isError, storyState.isLoading]);

  //let stories = useAppSelector((state) => state.stories);
  //console.log(stories)
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (user === null) {
      console.log("redirect");
      navigate("/login");
    }
  }, [user]);

  const { stories, isSuccess } = useAppSelector((state) => state.stories);

  const [itemsByStatus, setItemsByStatus] = useState<TaskboardData>(
    defaultItems
    //stories
  );

  const stringPriority = (priority: number): string[] => {
    switch (priority) {
      case 1:
        return ["Must have", "badge-light-must"];
      case 2:
        return ["Could have", "badge-light-could"];
      case 3:
        return ["Should have", "badge-light-should"];
      case 4:
        return ["Won't have this time", "gray-wont"];
      default:
        return [];
    }
  };

  const handleDragEnd: DragDropContextProps["onDragEnd"] = ({
    source,
    destination,
  }) => {
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        // dropped outside the list
        if (!destination) {
          return;
        }
        const [removed] = draft[
          source.droppableId as ProductBacklogItemStatus
        ].splice(source.index, 1);
        draft[destination.droppableId as ProductBacklogItemStatus].splice(
          destination.index,
          0,
          removed
        );
      })
    );
  };

  type HandleDeleteFunc = (args: {
    status: ProductBacklogItemStatus;
    itemToDelete: StoryData;
  }) => void;

  const handleDelete: HandleDeleteFunc = ({ status, itemToDelete }) =>
    setItemsByStatus((current) =>
      produce(current, (draft) => {
        draft[status] = draft[status].filter(
          (item) => item.id !== itemToDelete.id
        );
        setShow(false);
        dispatch(deleteStory(itemToDelete.id!));
        dispatch(getAllStory());
      })
    );

  //doda začetne elemnte

  useEffect(() => {
    //console.log(ProductBacklogItemStatus)
    //console.log(itemsByStatus)

    const isEmpty = Object.values(itemsByStatus).every(
      (value) => value.length === 0
    );
    console.log(isEmpty);
    if (isEmpty && isSuccess) {
      setItemsByStatus((current) =>
        produce(current, (draft) => {
          //for (const status of Object.values(ProductBacklogItemStatus)) {
          //  draft[status] = draft[status].filter(() => false);
          //}

          // Adding new item as "to do"

          stories.forEach((story: StoryData) => {
            draft[ProductBacklogItemStatus.UNALLOCATED].push({
              id: story.id?.toString(),
              title: story.title,
              description: story.description,
              tests: story.tests,
              priority: story.priority,
              businessValue: story.businessValue,
              sequenceNumber: story.sequenceNumber,
            });
          });
        })
      );
    }
  }, [isSuccess]);

  //{Object.values.map(([columnId, column], index) => {

  //modal za delete
  const [show, setShow] = useState(false);

  //modal za zgodbe
  const [showstory, setShowStory] = useState(false);

  const initvalue: StoryData = {
    id: "",
    title: "",
    description: "",
    tests: [],
    priority: 0,
    businessValue: 0,
    sequenceNumber: 0,
  };

  const [tempDataStory, setTempDataStory] = useState<StoryData>(initvalue);
  const getDataStory = (item: StoryData) => {
    setTempDataStory(item);
    return setShowStory(true);
  };

  const [points, setPonts] = useState("");
  const [visiblePoints, setVisiblePonts] = useState(true);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setVisiblePonts((prev) => !prev);
  };
  const handleKeyDown = (e: any) => {
    const val = e.target.value;
    if (e.target.validity.valid) setPonts(e.target.value);
    else if (val === "") setPonts(val);
  };

  return (
    <>
      <div className="row flex-row flex-sm-nowrap m-1 mt-3">
        <div className="text-center col-sm-4 col-md-3 col-xl-3 mt-3">
          <Button size="lg" variant="light">
            Wall
          </Button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.values(ProductBacklogItemStatus).map((status) => {
            //console.log(columns)
            return (
              <>
                <div className="col-sm-4 col-md-3 col-xl-3 mt-3" key={status}>
                  <Card className="bg-light border-0 ">
                    <div className="pt-3 hstack gap-2 mx-3">
                      <Card.Title className="fs-6 my-0">{status}</Card.Title>
                      <div className="vr my-0"></div>
                      <p className="fs-6 my-0">6</p>
                      {status === ProductBacklogItemStatus.UNALLOCATED && (
                        <Button className="ms-auto" variant="light">
                          New Card
                        </Button>
                      )}
                    </div>
                    <hr className="hr mx-3" />

                    <Droppable droppableId={status} key={status}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "#f8f9fa",
                              borderRadius: "0px 0px 5px 5px",
                            }}
                          >
                            {itemsByStatus[status].map((item, index) => {
                              console.log(status);

                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id!}
                                  index={index}
                                  isDragDisabled={
                                    status === ProductBacklogItemStatus.DONE
                                  }
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <>
                                        <Card
                                          className="mb-3 mx-3"
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            userSelect: "none",
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <Card.Header className="hstack gap-2 align-items-center">
                                            <p className="fs-6 text-muted m-1">
                                              TSK-{item.sequenceNumber}
                                            </p>

                                            <Dropdown className="ms-auto">
                                              <Dropdown.Toggle
                                                variant="link"
                                                id="dropdown-custom-components"
                                                bsPrefix="p-0"
                                              >
                                                <ThreeDots />
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu>
                                                <Dropdown.Item>
                                                  <Pencil /> Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  onClick={() => setShow(true)}
                                                  /* onClick={() =>
                                              Modal.confirm({
                                                title: 'Delete?',
                                                content: `Are you sure to delete "${item.title}"?`,
                                                onOk: () =>
                                                  onDelete({
                                                    status,
                                                    itemToDelete: item,
                                                  }),
                                              })
                                            } */
                                                >
                                                  <Trash /> Delete
                                                </Dropdown.Item>
                                                <DeleteConfirmation
                                                  item={item}
                                                  status={status}
                                                  onCancel={() =>
                                                    setShow(false)
                                                  }
                                                  show={show}
                                                  onDelete={handleDelete}
                                                />
                                                <Dropdown.Item href="#/action-3">
                                                  Something else
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </Card.Header>
                                          <Card.Body>
                                            <Card.Text
                                              onClick={() => getDataStory(item)}
                                              className="m-0"
                                            >
                                              <Button
                                                className="text-decoration-none"
                                                variant="link"
                                              >
                                                {item.title}
                                              </Button>
                                            </Card.Text>

                                            <div className="text-end">
                                              <small className="custom-font-size text-muted mb-1 d-inline-block">
                                                25%
                                              </small>
                                            </div>
                                            <ProgressBar
                                              style={{ height: "3px" }}
                                              now={60}
                                            />

                                            <div className="pt-3 hstack gap-2 ">
                                              <p
                                                className={`my-0 badge rounded-pill ${
                                                  classes[
                                                    stringPriority(
                                                      item.priority
                                                    )[1]
                                                  ]
                                                }`}
                                              >
                                                {
                                                  stringPriority(
                                                    item.priority
                                                  )[0]
                                                }{" "}
                                              </p>

                                              <p className="  ms-auto fs-6  text-muted my-0">
                                                BV: {item.businessValue}
                                              </p>

                                              <div className="vr"></div>
                                              <p className="text-nowrap text-muted my-0">
                                                {" "}
                                                2h
                                              </p>

                                              <Clock className=" text-muted" />
                                            </div>
                                          </Card.Body>

                                          <ListGroup variant="flush">
                                            <ListGroup.Item>
                                              <Row>
                                                <Col sm={7}>
                                                  Time complexity:{" "}
                                                </Col>
                                                <Col sm={5}>
                                                  {visiblePoints && (
                                                    <Form
                                                      onSubmit={handleSubmit}
                                                      className=" ms-auto"
                                                    >
                                                      <InputGroup size="sm">
                                                        <Form.Control
                                                          className="mobileBox"
                                                          size="sm"
                                                          pattern="[0-9]*"
                                                          required
                                                          placeholder="PT"
                                                          onChange={
                                                            handleKeyDown
                                                          }
                                                          value={points}
                                                          type="tel"
                                                          maxLength={2}
                                                        />
                                                        <InputGroup.Text className="">
                                                          PT
                                                        </InputGroup.Text>
                                                      </InputGroup>
                                                    </Form>
                                                  )}
                                                  {!visiblePoints && (
                                                    <Button
                                                      onClick={() =>
                                                        setVisiblePonts(
                                                          (prev) => !prev
                                                        )
                                                      }
                                                      variant="link"
                                                      className="m-0 p-0 float-end text-decoration-none"
                                                    >
                                                      {points}
                                                    </Button>
                                                  )}
                                                </Col>
                                              </Row>
                                            </ListGroup.Item>
                                          </ListGroup>
                                        </Card>
                                      </>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}

                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </Card>
                </div>
              </>
            );
          })}
        </DragDropContext>
      </div>

      {showstory && (
        <StoryModal
          item={tempDataStory}
          onCancel={() => setShowStory(false)}
          show={showstory}
        />
      )}
    </>
  );
}

export default Dashboard;