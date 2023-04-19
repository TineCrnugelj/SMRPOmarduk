import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Card from "../components/Card";
import { Form } from "react-bootstrap";

import classes from "./AddStory.module.css";

import { StoryData } from "../classes/storyData";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getAllStory } from "../features/stories/storySlice";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AddStory = () => {
  const dispatch = useAppDispatch();
  let state = useAppSelector((state) => state.stories);

  const [storyData, setStoryData] = useState({
    id: "",
    title: "",
    description: "",
    tests: [""],
    priority: "3", // 3 => must have, 0 => won't have this time
    businessValue: "",
    sequenceNumber: "",
  });

  const [titleError, setTitleError] = useState(false);
  const [businessValueError, setBusinessValueError] = useState(false);
  const [sequenceNumberError, setSequenceNumberError] = useState(false);
  const [testsError, setTestsError] = useState([false]);

  const [titleTouched, setTitleTouched] = useState(false);
  const [businessValueTouched, setBusinessValueTouched] = useState(false);
  const [sequenceNumberTouched, setSequenceNumberTouched] = useState(false);
  const [testsTouched, setTestsTouched] = useState([false]);

  const wasAnythingTouched =
    titleTouched ||
    businessValueTouched ||
    sequenceNumberTouched ||
    testsTouched.includes(true);

  const formIsValid =
    titleTouched &&
    !titleError &&
    businessValueTouched &&
    !businessValueError &&
    sequenceNumberTouched &&
    !sequenceNumberError &&
    !testsError.includes(true) &&
    !testsTouched.includes(false);

  const {id, title, description, priority, businessValue, tests, sequenceNumber } =
    storyData;

  // for adding inputs in the 'Tests' section
  const addInputHandler = () => {
    setStoryData((prevStoryData) => ({
      ...prevStoryData,
      tests: [...prevStoryData.tests, ""],
    }));
    setTestsError((prevTestsError) => [...prevTestsError, false]);
    setTestsTouched((prevTestsTouched) => [...prevTestsTouched, false]);
  };

  // for removing inputs in the 'Tests' section
  const removeInputHandler = (index: any) => {
    setStoryData((prevStoryData) => {
      const newTestsArray = [...prevStoryData.tests];
      newTestsArray.splice(index, 1);
      return {
        ...prevStoryData,
        tests: [...newTestsArray],
      };
    });
  };

  const storyDataChangedHandler = (e: any) => {
    setStoryData((prevStoryData) => ({
      ...prevStoryData,
      [e.target.name]: e.target.value,
    }));
  };

  // handle inputs for tests
  const testInputChangedHandler = (e: any, index: number) => {
    setStoryData((prevStoryData) => {
      const newTestsData: string[] = [...prevStoryData.tests];
      newTestsData[index] = e.target.value;
      return { ...prevStoryData, tests: newTestsData };
    });
  };


  //handle input for priority selection
  const selectInputChangedHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStoryData((prevStoryData) => ({
      ...prevStoryData,
      priority: e.target.value,
    }));
  };

  // title validation
  const checkStoryTitle = () => {
    storyData.title.trim() === "" ? setTitleError(true) : setTitleError(false);
    setTitleTouched(true);
  };

  // business value validation
  const checkBusinessValue = () => {
    setBusinessValueTouched(true);

    if (businessValue.trim() === "") {
      setBusinessValueError(true);
      return;
    }

    parseInt(businessValue) < 0 || parseInt(businessValue) > 10
      ? setBusinessValueError(true)
      : setBusinessValueError(false);
  };

  // sequence number validation
  const checkSequenceNumber = () => {
    setSequenceNumberTouched(true);
    if (sequenceNumber.trim() === "") {
      setSequenceNumberError(true);
      return;
    }

    parseInt(sequenceNumber) < 1
      ? setSequenceNumberError(true)
      : setSequenceNumberError(false);
  };

  // tests validation
  const checkTestInput = (index: number) => {
    const inputValue = storyData.tests[index];
    const newTestsError = [...testsError];
    newTestsError[index] = inputValue.trim() === "";
    setTestsError(newTestsError);

    setTestsTouched((prevTestsTouched) => {
      const newTestsTouched = [...prevTestsTouched];
      newTestsTouched[index] = true;
      return newTestsTouched;
    });
  };

  // handle submit
  const submitFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newStory: StoryData = {
      id,
      title,
      description,
      tests,
      priority: parseInt(priority),
      businessValue: parseInt(businessValue),
      sequenceNumber: parseInt(sequenceNumber),
    };

    console.log(storyData);

    // send to backend
    //dispatch(createStory(newStory));

    // set inputs to default values

    setStoryData({
      id: "",
      title: "",
      description: "",
      tests: [""],
      priority: "3",
      businessValue: "",
      sequenceNumber: "",
    });

    // set validation values back to default
    setTitleTouched(false);
    setSequenceNumberTouched(false);
    setTestsTouched([false]);
    setBusinessValueTouched(false);
  };

  return (
    <div className={classes.cardContainer}>
      <Card>
        <h1 className={`${classes.cardHeading} text-primary`}>
          Add User Story
        </h1>
        <Form onSubmit={submitFormHandler}>
          <Row>
            <Col>
              <Form.Group className="mb-1" controlId="form-business-value">
                <Form.Label>Story Number</Form.Label>
                <Form.Control
                  isInvalid={sequenceNumberError}
                  placeholder="Enter #"
                  name="sequenceNumber"
                  value={sequenceNumber}
                  onChange={storyDataChangedHandler}
                  onBlur={checkSequenceNumber}
                  type="number"
                />
                <Form.Text className="text-secondary">
                  Enter a unique, positive number
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs="12" md="8">
              <Form.Group className="mb-1" controlId="form-title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  isInvalid={titleError}
                  placeholder="Add story title"
                  name="title"
                  value={title}
                  onChange={storyDataChangedHandler}
                  onBlur={checkStoryTitle}
                />
                <Form.Text className="text-secondary">
                  Story titles must be unique.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4 mt-3" controlId="form-description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Add story description"
              name="description"
              value={description}
              onChange={storyDataChangedHandler}
            />
          </Form.Group>

          <Form.Group
            className={`mb-3 ${classes.testsGroup}`}
            controlId="form-tests"
          >
            <Form.Label>Tests</Form.Label>

            <Form.Group className="mb-3" controlId="form-tests">
              {storyData.tests.map((input, index) => (
                <Form.Group key={index} className="mb-2">
                  <Form.Text className="text-secondary">{`Test ${
                    index + 1
                  }`}</Form.Text>
                  <Row>
                    <Col>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={input}
                        placeholder="Add test"
                        onChange={(e) => {
                          console.log();
                          testInputChangedHandler(e, index);
                        }}
                        onBlur={() => checkTestInput(index)}
                        isInvalid={testsError[index] ? true : false}
                      />
                    </Col>
                    <Col xs="12" md="3">
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => removeInputHandler(index)}
                      >
                        Remove test
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              ))}
            </Form.Group>
            <Form.Text className="text-secondary d-block mb-3">
              Make sure all the test fields you add are filled in.
            </Form.Text>
            <Button
              variant="outline-primary"
              type="button"
              onClick={addInputHandler}
              className="mb-1"
            >
              Add another test
            </Button>
          </Form.Group>
          <Row className="mb-3">
            <Col xs="12" md="6">
              <Form.Group controlId="form-priority">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  aria-label="Select story priority"
                  onChange={selectInputChangedHandler}
                  value={priority}
                  name="priority"
                  placeholder="Select priority"
                >
                  <option value="3">Must have</option>
                  <option value="2">Should have</option>
                  <option value="1">Could have</option>
                  <option value="0">Won't have this time</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs="12" md="6">
              <Form.Group controlId="form-business-value">
                <Form.Label>Business value</Form.Label>
                <Form.Control
                  isInvalid={businessValueError}
                  placeholder="Enter business value"
                  name="businessValue"
                  value={businessValue}
                  onChange={storyDataChangedHandler}
                  onBlur={checkBusinessValue}
                  type="number"
                />
                <Form.Text className="text-secondary">
                  Enter a number between 0 and 10.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          {state.isError && !state.isLoading && !wasAnythingTouched && (
            <Alert variant={"danger"}>{state.message}</Alert>
          )}
          {state.isSuccess && !state.isLoading && !wasAnythingTouched && (
            <Alert variant={"success"}>Story added successfully!</Alert>
          )}
          <Button
            variant="primary"
            type="submit"
            size="lg"
            disabled={!formIsValid}
          >
            Add story
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AddStory;
