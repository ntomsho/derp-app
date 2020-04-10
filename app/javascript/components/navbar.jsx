import React, { useState, useEffect } from 'react';
import { logout } from '../actions/session_actions';

const Navbar = () => {

    const [charsList, setCharsList] = useState();
    const [campaignList, setCampaignsList] = useState();

    if (window.currentUser) {
        return (
            <div id="navbar-main">
                <div>{window.currentUser.username}</div>
                <button onClick={logout}>Logout</button>
            </div>
        )
    } else {
        return null;
    }
}

export default Navbar;
