import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { StoryData } from "../classes/storyData";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllUsers } from "../features/users/userSlice";
import { useEffect, useState } from "react";
import { Trash } from "react-bootstrap-icons";











export interface StoryModalProps {
    onCancel: VoidFunction
    show: boolean
    item: StoryData
}

function TaskModal({ 
    onCancel,
    show,
    item,
}: StoryModalProps) {

  let {users, user} = useAppSelector(state => state.users);
  const [allUsers, setAllUsers] = useState<String[]>([]);
  const [tests, setTests] = useState([""]);
  const [testsTouched, setTestsTouched] = useState([false]);

  const addInputHandler = () => {
    setTests((prevTests) => [...prevTests, ""]);
    setTestsTouched((prevTestsTouched) => [...prevTestsTouched, false]);
  };

  // for removing inputs in the 'Tests' section
  const removeInputHandler = (index: any) => {
    setTests((prevTests) => {
      const newTestsArray = [...prevTests];
      newTestsArray.splice(index, 1);
      return [...newTestsArray];
    });

    setTestsTouched((prevTestsTouched) => {
      const newTestsTouched = [...prevTestsTouched];
      newTestsTouched.splice(index, 1);
      return newTestsTouched;
    });
  };

  const resetInputs = () => {
    // set inputs to default values
    setTests([""]);
    // set touch states values back to default
    setTestsTouched([false]);
  };

  const testChangedHandler = (e: any, index: number) => {
    setTests((prevTests) => {
      const newTests = [...prevTests];
      newTests[index] = e.target.value;
      return newTests;
    });
  };


  useEffect(() => {
    if (!(users.length === 0)){
      const usernames = users.map(user => user.username);
      setAllUsers(usernames)
    }
  }, [users]);
  

    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(getAllUsers())
    }, [])

    return (


        <Modal
        
        show={show} 
        
        onHide={onCancel}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered>
             <Modal.Header
          closeButton
        >
          <Modal.Title>Extra Large Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col>#</Col>
                <Col>Title</Col>
                <Col>Status</Col>
                <Col>User</Col>
                <Col>Remaining Time</Col>
                <Col>Estimated Time</Col>
                <Col></Col>
            </Row>
            <Form.Group className="mb-3" controlId="form-tests">
            {tests.map((input, index) => (
                <Form.Group key={index} className="mb-2">


            <Row>
                <Col>id</Col>
                <Col><Form.Control form='my_form' size="sm" placeholder="Title"/></Col>
                <Col>Status</Col>
                <Col>
                  <Form.Select form='my_form' size="sm" defaultValue="Choose..." >
                  <option>/</option>
                  {allUsers.map((user) => (
                    <option key={allUsers.indexOf(user)}>{user}</option>

                    ))}
        
                  </Form.Select>
                </Col>
                <Col>/</Col>
                <Col> <Form.Control form='my_form' size="sm" placeholder="Title"/></Col>
                <Col>
                        <Button
                          variant="link"
                          type="button"
                          onClick={() => removeInputHandler(index)}
                        >
                          <Trash/>
                        </Button>
                  </Col>
                    

            </Row>

            </Form.Group>
            ))}
           </Form.Group>
           <Button
              variant="outline-primary"
              type="button"
              onClick={addInputHandler}
              className="mb-1"
            >
              Add another test
            </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onCancel}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>
    )


}


export default TaskModal;