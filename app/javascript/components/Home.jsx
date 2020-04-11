import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';

export default function Home() {
    // This loggedIn setup doesn't rerender the navbar, needs to be a single solution
    const [loggedIn, setLoggedIn] = useState(!!window.currentUser);

    const sessionForms = () => {
        if (!loggedIn) {
            return (
                <div>
                    <h3>Returning?</h3>
                    <SignInForm setLoggedIn={setLoggedIn} />
                    <br/>
                    <h3>Create Account</h3>
                    <SignUpForm setLoggedIn={setLoggedIn} />
                </div>
            )
        }
    }
    
    return (
        <div id="home-container">
            {loggedIn ? 
                <Link to="/ged">
                    <button id="dnd-button">
                        <h3>GED</h3> <br /> Guild of Expendable Dungeoneers
                    </button>
                </Link> :
                sessionForms()}
        </div>
    )
}