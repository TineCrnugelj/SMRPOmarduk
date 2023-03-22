import {Container, Nav, Navbar, NavDropdown, } from 'react-bootstrap';
import { HouseDoorFill, PersonCircle, Bell, QuestionCircle, Calendar } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getLastLogin, logout } from '../features/users/userSlice';
import { Fragment, useEffect, useState } from 'react';
import { parseDate, parseJwt } from '../helpers/helpers';
import { useNavigate } from 'react-router-dom';

function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user, lastLogin} = useAppSelector(state => state.users);
    const [userName, setUserName] = useState('');
    const [isAdmin, setIsAdmin]   = useState(false);
    const [lastLoginDate, setLastLoginDate] = useState('');
    
    useEffect(() => {
        if (user === null) {
            return;
        }
        const token = JSON.parse(localStorage.getItem('user')!).token;
        const userData = parseJwt(token);
        setIsAdmin(userData.isAdmin);
        setUserName(userData.sub);
        dispatch(getLastLogin(userData.sid));
        setLastLoginDate(lastLogin);
    }, [user, lastLogin]);

    const handleLoginAndLogout = () => {
        if (user !== null) {
            dispatch(logout());
            window.location.replace('/login');
        }
    }

    const redirectToUsers = () => {
        navigate('/users');
    }

    const redirectToNewSprint = () => {
        navigate('/add-sprint');
    }

    const redirectToAddUser = () => {
        navigate('/add-user');
    }

    const redirectToChangePassword = () => {
        navigate('/change-password');
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
            <Container >
                <Navbar.Brand  href="/" className="hstack"><HouseDoorFill className="me-2"></HouseDoorFill> Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                    <NavDropdown
                        id="sprint-dropdown"
                        title={<span><Calendar className="mb-1"></Calendar> Sprints</span>}
                    >   
                        <NavDropdown.Item onClick={redirectToNewSprint}>+ Add sprint</NavDropdown.Item>
                        <NavDropdown.Item>Sprint 1</NavDropdown.Item>
                        <NavDropdown.Item>Sprint 2</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title={user !== null ? 
                                            (   
                                                <div style={{display: 'inline-flex'}}>
                                                    <span><PersonCircle className="mb-1"></PersonCircle> {userName}, </span>
                                                    {lastLoginDate ? <p>Last login: {parseDate(lastLoginDate)}</p> : <p>Last login: First login</p>}
                                                </div>
                                            ) : 
                                            <span><PersonCircle className="mb-1"></PersonCircle> Account</span>} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={handleLoginAndLogout}>{user === null ? 'Log in' : 'Logout'}</NavDropdown.Item>
                    <NavDropdown.Item onClick={redirectToChangePassword}>
                        Change password
                    </NavDropdown.Item>
                    {
                        isAdmin && 
                        (   
                            <Fragment>
                                <NavDropdown.Item onClick={redirectToUsers}>
                                    Users
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={redirectToAddUser}>
                                    + Add user
                                </NavDropdown.Item>
                            </Fragment>
                        )
                    }
                    </NavDropdown>    
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        )
    }
    
export default Header;