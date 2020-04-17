import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import SignUpForm from './signup_form';
import SignInForm from './login_form';
import NotificationsList from './notifications_list';
import { logout } from '../actions/session_actions';
import { fetchCharacters } from '../actions/character_actions';

const NavbarComp = (props) => {
    
    const history = useHistory();
    const location = useLocation();
    const [notifications, setNotifications] = useState(props.loggedInUser.campaign_invites)
    const [joinRequests, setJoinRequests] = useState(props.loggedInUser.join_requests)
    const [myCharacters, setMyCharacters] = useState([])

    useEffect(() => {
        fetchCharacters(props.loggedInUser.id, setMyCharacters);
    }, [])

    const logMeOut = () => {
        logout(props.setLoggedInUser);
        if (location.pathname !== "/") history.push("/");
    }

    if (props.loggedInUser) {
        return (
            <>
            <Navbar expand="md" bg="dark" variant="dark">
                <Navbar.Brand className="text-light" href="/">DERP</Navbar.Brand>
                <Navbar.Text className="text-primary">{props.loggedInUser.username}</Navbar.Text>
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link className="text-light" href="/ged_home">GED</Nav.Link>
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
                    <NotificationsList list={notifications} listSetter={setNotifications} />
                    <NotificationsList list={joinRequests} listSetter={setJoinRequests} />
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
