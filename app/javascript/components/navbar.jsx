import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';
import { logout } from '../actions/session_actions';

const Navbar = () => {
    
    const history = useHistory();
    const location = useLocation();
    const [charsList, setCharsList] = useState();
    const [campaignList, setCampaignsList] = useState();

    const logoutAndReturn = () => {
        logout();
        location.pathname === "/" ?
        window.location.reload() : 
        history.push("/")
    }

    if (window.currentUser) {
        return (
            <div id="navbar-main">
                <div>{window.currentUser.username}</div>
                <button onClick={logoutAndReturn}>Logout</button>
            </div>
        )
    } else {
        return (
            <div id="navbar-main">
                <SignInForm />
                <SignUpForm />
            </div>
        )
    }
}

export default Navbar;
