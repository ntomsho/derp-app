import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import SignUpForm from './signup_form';
import SignInForm from './login_form';
import NotificationsList from './notifications_list';
import { logout } from '../actions/session_actions';
import { fetchCharacters } from '../actions/character_actions';

const NavbarComp = (props) => {
    
    const history = useHistory();
    const location = useLocation();
    const [notifications, setNotifications] = useState(props.loggedInUser.received_invites.concat(props.loggedInUser.campaign_received_invites));
    const [myCharacters, setMyCharacters] = useState([])

    useEffect(() => {
        fetchCharacters(props.loggedInUser.id, setMyCharacters);
    }, [])

    const logMeOut = () => {
        logout(props.setLoggedInUser);
        if (location.pathname !== "/") history.push("/");
    }

    const clearNotification = (invite) => {
        let newState = Object.assign([], notifications);
        for (let i = 0; i < newState.length; i++) {
            if (newState[i].id === invite.id) {
                newState.splice(i, 1);
            }
        }
        setNotifications(newState);
    }

    if (props.loggedInUser) {
        return (
            <>
            <Navbar expand="md" bg="dark" variant="dark">
                <Navbar.Brand className="text-light grenze" href="/">DERP</Navbar.Brand>
                <Navbar.Text className="text-primary">{props.loggedInUser.username}</Navbar.Text>
                <NavDropdown className="text-light"
                    title={<span>Notifications <Badge pill variant="danger">{notifications.length}</Badge></span>}
                >
                    {notifications.map(notification => {
                        return (
                            <NavDropdown.Item key={notification.id} 
                                style={{whiteSpace: 'normal'}}
                                href={notification.requester_type === "Campaign" ? `/ged/campaigns/${notification.requester_id}` : `/ged/campaigns/${notification.requested_id}`}
                            >
                                <div>
                                    {notification.requester_type === "Campaign" ? 
                                        <small><strong>{notification.requester_director.username}</strong> has invited you to join their campaign <strong>{notification.requester_title}</strong></small> :
                                        <small><strong>{notification.requester_username}</strong> has requested to join your campaign <strong>{notification.requested_title}</strong></small>
                                    }
                                </div>
                                <div>
                                    <Button variant="success" onClick={() => deleteInvite(notification.id, true, clearNotification)}>Accept</Button>
                                    <Button variant="danger" onClick={() => deleteInvite(notification.id, false, clearNotification)}>Reject</Button>
                                </div>
                            </NavDropdown.Item>
                        )
                    })}
                </NavDropdown>
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link className="text-light" href="/ged">GED</Nav.Link>
                    </Nav>
                    <NavDropdown className="text-light" title="Your Characters">
                        {myCharacters.map((character) => {
                            if (!character.dead) {
                                return (
                                    <NavDropdown.Item key={character.id} href={`/ged/characters/${character.id}`}>
                                        {character.name} - Level {character.level} {character.c_class}
                                    </NavDropdown.Item>
                                )
                            }
                        })}
                    </NavDropdown>
                    <Button className="ml-md-auto" onClick={logMeOut} variant="light">Logout</Button>
                </Navbar.Collapse>
                <Navbar.Toggle className="ml-auto" />
            </Navbar>
            </>
        )
    } else {
        return (
            <>
            <Navbar bg="dark" variant="dark">
                <SignInForm setLoggedIn={props.setLoggedInUser} />
                <SignUpForm setLoggedIn={props.setLoggedInUser} />
            </Navbar>
            </>
        )
    }
}

export default NavbarComp;
