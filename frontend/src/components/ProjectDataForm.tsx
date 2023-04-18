import { Fragment, useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Card from "../components/Card";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import classes from "./ProjectForm.module.css";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { parseJwt } from "../helpers/helpers";
import { getAllUsers } from "../features/users/userSlice";
import { ProjectData, UserRole } from "../classes/projectData";
import {
  createProject,
  editProject,
  getAllProjects,
  reset,
} from "../features/projects/projectSlice";
import { UserData } from "../classes/userData";
import { ProjectState } from "../features/projects/projectSlice";
import { toast } from "react-toastify";

interface ProjectProps {
  idInit?: string;
  projectNameInit: string;
  projectDescriptionInit?: string;
  projectState: ProjectState;
  handleSubmitForm: () => void;
}

const ProjectDataForm: React.FC<ProjectProps> = ({
  idInit,
  projectNameInit,
  projectDescriptionInit,
  projectState,
  handleSubmitForm,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (projectState.isSuccess && !projectState.isLoading && formIsValid) {
      toast.success("Project successfully created!");
      dispatch(reset());
      // dispatch(getAllProjects());
    }
    if (projectState.isError && !projectState.isLoading) {
      toast.error(projectState.message);
      dispatch(reset());
      // dispatch(getAllProjects());
    }
  }, [projectState.isSuccess, projectState.isError, projectState.isLoading]);

  const [projectName, setProjectName] = useState(projectNameInit);
  const [projectDescription, setProjectDescription] = useState(
    projectDescriptionInit ? projectDescriptionInit : ""
  );

  const [projectNameTouched, setProjectNameTouched] = useState(false);
  // const [projectDescriptionTouched, setProjectDescriptionTouched] =
  //   useState(false);

  const [invalidFormMessage, setInvalidFormMessage] = useState("");

  const enteredNameValid = projectName.trim() !== "";

  const nameInputInvalid = projectNameTouched && !enteredNameValid;

  const formIsValid = enteredNameValid;

  const projectNameChangedHandler = (e: any) => {
    setProjectName(e.target.value);
  };

  const projectNameBlurHandler = (e: any) => {
    setProjectNameTouched(true);
  };

  const projectDescriptionChangedHandler = (e: any) => {
    setProjectDescription(e.target.value);
  };

  const submitFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setProjectNameTouched(true);

    // display error msg if form is invalid
    if (!formIsValid) {
      toast.error("Make sure to properly fill out all required fields.");
      return;
    }

    // TODO rewrite this !!!
    const token = JSON.parse(localStorage.getItem("user")!).token;
    const id = parseJwt(token).sid;

    const updatedProject: any = {
      id: idInit,
      userId: id,
      projectName: projectName.trim(),
      projectDescription: projectDescription.trim(),
    };

    console.log(updatedProject);

    dispatch(editProject(updatedProject));
  };

  return (
    <Fragment>
      <h1 className={`${classes.cardHeading} text-primary`}>Edit project</h1>

      <Form onSubmit={submitFormHandler}>
        <Form.Group className="mb-3" controlId="form-title">
          <Form.Label>Project name</Form.Label>
          <Form.Control
            placeholder="Add project name"
            name="projectName"
            value={projectName}
            onChange={projectNameChangedHandler}
            onBlur={projectNameBlurHandler}
            isInvalid={nameInputInvalid}
          />
          <Form.Text>Add a unique project name.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-4 mt-3" controlId="form-description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Add project description"
            name="projectDescription"
            value={projectDescription}
            onChange={projectDescriptionChangedHandler}
          />
        </Form.Group>
        <Button variant="primary" type="submit" size="lg" disabled={false}>
          Add project
        </Button>
      </Form>
    </Fragment>
  );
};

export default ProjectDataForm;
