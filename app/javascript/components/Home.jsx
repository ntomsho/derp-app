import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';

const Home = (props) => {
    // This loggedIn setup doesn't rerender the navbar, needs to be a single solution
    // const [loggedInUser, setLoggedInUser] = useState(window.currentUser || null);

    const sessionForms = () => {
        return (
            <div>
                <h3>Returning?</h3>
                <SignInForm setLoggedIn={props.setLoggedInUser} />
                <br/>
                <h3>Create Account</h3>
                <SignUpForm setLoggedIn={props.setLoggedInUser} />
            </div>
        )
    }

    return (
        <div id="home-container">
            {props.loggedInUser ? 
                <Link to="/ged">
                    <button id="dnd-button">
                        <h3>GED</h3> <br /> Guild of Expendable Dungeoneers
                    </button>
                </Link> :
                sessionForms()}
        </div>
    )
}

export default Home;
