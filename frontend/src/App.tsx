import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import AddSubtask from "./pages/AddSubtask";
import Home from "./pages/Home";
import AddUser from "./pages/AddUser";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import AddStory from "./pages/AddStory";
import Users from "./pages/Users";

import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

import AddProject from "./pages/AddProject";
import AddSprint from "./pages/AddSprint";

import ProductBacklog from './pages/ProductBacklog';
import SprintBacklog from './pages/SprintBacklog';
import MyTasks from './pages/MyTasks';


function App() {
  return (
    <Fragment>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ProductBacklog />} />
          <Route path="/add-user" element={
            <AddUser
              isEdit={false}
              usernameInit=''
              passwordInit=''
              confirmPasswordInit=''
              firstNameInit=''
              lastNameInit=''
              emailInit=''
              isAdminInit={false}
              handleClose={() => {}}
            />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/add-subtask" element={<AddSubtask />} />
          <Route path='/add-story' element={<AddStory />} />
          <Route path='/users' element={<Users />} />
          <Route path='/add-project' element={<AddProject />} />
          <Route path='/add-sprint' element={<AddSprint />} />
          <Route path='/product-backlog' element={<ProductBacklog />} />
          <Route path='/sprint-backlog' element={<SprintBacklog />} />
          <Route path='/my-tasks' element={<MyTasks />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
