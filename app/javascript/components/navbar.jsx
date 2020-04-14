import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';
import { logout } from '../actions/session_actions';
import { deleteInvite } from '../actions/invite_actions';

const Navbar = (props) => {
    
    const history = useHistory();
    const location = useLocation();

    const logMeOut = () => {
        logout(props.setLoggedInUser);
        if (location.pathname !== "/") history.push("/");
    }

    const campaignNotifications = () => {
        if (props.loggedInUser.campaign_invites.length > 0) {
            return (
                <div>
                    <ul>
                        {props.loggedInUser.campaign_invites.map(invite => {
                            if (!invite.viewed) {
                                return (
                                    <li key={invite.id}>
                                        <div>{invite.director} has invited you to join their campaign {invite.title}</div>
                                        <button onClick={deleteInvite(invite.id, true)}>Accept</button>
                                        <button onClick={deleteInvite(invite.id, false)}>Reject</button>
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
