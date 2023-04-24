import React, { useEffect, useState } from "react";
import { Button, Card, Nav, Tab, Table } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { StoryData } from '../classes/storyData';

import { getAllStory } from "../features/stories/storySlice";
import classes from './Dashboard.module.css';
import LogTimeModal from "../components/LogTimeModal";

function Dashboard() {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  
  //demo
  const initialList = [
    {
      id: 1,
      title: "title1",
      status: "Start Work",
      user: "matevz",
      workedTime: 3,
      remainingTime: 2,
      estimatedTime: 6
    },
    {
      id: 2,
      title: "title2",
      status: "Release task",
      user: "janez",
      workedTime: 4,
      remainingTime: 1,
      estimatedTime: 5
    },
  ];
  const [list, setList] = useState(initialList);


  useEffect(() => {
    dispatch(getAllStory())
  }, [])


  //let stories = useAppSelector((state) => state.stories);
  //console.log(stories)
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.users);

  
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  let { stories, isSuccess} = useAppSelector((state) => state.stories);


  const [itemsByStatus, setItemsByStatus] = useState<StoryData[]>([]);

  const stringPriority = (priority: number): string[] => {
    switch(priority) {
      case 0:
        return ['Must have', 'badge-light-must'];
      case 1:
        return ['Could have', 'badge-light-could'];
      case 2: 
        return ['Should have', 'badge-light-should'];
      case 3: 
        return ["Won\'t have this time", 'gray-wont'];
      default:
        return [];
    }
  }

  useEffect(() => {
    const isEmpty = Object.values(itemsByStatus).every(value => value);
    if (isEmpty && isSuccess) {
      
          
          setItemsByStatus(stories);
          
    }
  }, [isSuccess]);
  
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
    isRealized: false
  };

  const openLogTimeModal = () => {
    setShowModal(true);
  }

  const hideModal = () => {
    setShowModal(false);
  }

  
  return (
    <>
    <div className="row flex-row flex-sm-nowrap m-1 mt-3 justify-content-center">
    <div className="col-sm-10 col-md-8 col-xl-6 mt-3">
      
    {Object.values(itemsByStatus).map((item) => {
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
                <Card.Text>
                  {item.description}
                </Card.Text>
                
      
                                        
      <Table borderless responsive="lg"   className={` ${classes["gfg"]} small align-middle`}>
      <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            
            <th>Work Done</th>
            <th>Remaining time</th>
            <th>Estimated time</th>
          </tr>
        </thead>
        
      <tbody>

      {list.map((item) => (
        <tr key={item.id}>
          <td >{item.id}</td>
          <td >{item.title}</td>
          <td ><Button className="align-middle text-decoration-none" variant="link">{item.status}</Button></td>
          
          <td >{item.workedTime}</td>
          <td >{item.remainingTime}</td>
          <td >{item.estimatedTime}</td>
          <td ><Button variant="outline-primary" size="sm" onClick={openLogTimeModal}>Work History</Button></td>
        </tr>
      ))}
</tbody>
      </Table>
     
     

                
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                dfvdf
              </Tab.Pane>
            </Tab.Content>
            </Card.Body>
        
      </Tab.Container>
      </Card> 
            
      )
    })}
    
       
   
     
    </div>
       
    </div>
       
        
         {/* showstory && <StoryModal item={tempDataStory} } />*/}
        
    
    {showModal && <LogTimeModal showModal={showModal} hideModal={hideModal} />}
  </>
  );
}

export default Dashboard;
