import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';
import NotificationsList from './notifications_list';
import { logout } from '../actions/session_actions';

const Navbar = (props) => {
    
    const history = useHistory();
    const location = useLocation();
    const [notifications, setNotifications] = useState(props.loggedInUser.campaign_invites)
    const [joinRequests, setJoinRequests] = useState(props.loggedInUser.join_requests)

    const logMeOut = () => {
        logout(props.setLoggedInUser);
        if (location.pathname !== "/") history.push("/");
    }

    if (props.loggedInUser) {
        return (
            <div id="navbar-main">
                <div>{props.loggedInUser.username}</div>
                <button onClick={logMeOut}>Logout</button>
                <Link to={"/"}><button>Home</button></Link>
                <NotificationsList list={notifications} listSetter={setNotifications} />
                <NotificationsList list={joinRequests} listSetter={setJoinRequests} />
            </div>
        )
    } else {
        return (
            <div id="navbar-main">
                <SignInForm setLoggedIn={props.setLoggedInUser} />
                <SignUpForm setLoggedIn={props.setLoggedInUser} />
            </div>
        )
    }
}

export default Navbar;
