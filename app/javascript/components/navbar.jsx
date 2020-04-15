import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';
import { logout } from '../actions/session_actions';
import { deleteInvite } from '../actions/invite_actions';

const Navbar = (props) => {
    
    const history = useHistory();
    const location = useLocation();
    const [notifications, setNotifications] = useState(props.loggedInUser.campaign_invites)

    const logMeOut = () => {
        logout(props.setLoggedInUser);
        if (location.pathname !== "/") history.push("/");
    }

    const clearNotification = (invite_index) => {
        debugger
        let newNotifications = Object.assign([], notifications);
        //Make this less awful later
        newNotifications.forEach((notification, i) => {
            if (notification.id === invite_index.id) {
                newNotifications.splice(i, 1);
            }
        });
        setNotifications(newNotifications);
    }

    const campaignNotifications = () => {
        if (props.loggedInUser.campaign_invites.length > 0) {
            return (
                <div>
                    <ul>
                        {props.loggedInUser.campaign_invites.map((invite, i) => {
                            if (!invite.viewed) {
                                return (
                                    <li key={invite.id}>
                                        <div>{invite.director} has invited you to join their campaign {invite.title}</div>
                                        <button onClick={() => deleteInvite(invite.id, true, clearNotification)}>Accept</button>
                                        <button onClick={() => deleteInvite(invite.id, false, clearNotification)}>Reject</button>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            )
        }
    }

    if (props.loggedInUser) {
        return (
            <div id="navbar-main">
                <div>{props.loggedInUser.username}</div>
                <button onClick={logMeOut}>Logout</button>
                {campaignNotifications()}
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
