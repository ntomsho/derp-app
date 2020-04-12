import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';
import { logout } from '../actions/session_actions';

const Navbar = (props) => {
    
    const history = useHistory();
    const location = useLocation();
    const [charsList, setCharsList] = useState();
    const [campaignList, setCampaignsList] = useState();

    if (props.loggedInUser) {
        return (
            <div id="navbar-main">
                <div>{props.loggedInUser.username}</div>
                <button onClick={() => logout(props.setLoggedInUser)}>Logout</button>
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
