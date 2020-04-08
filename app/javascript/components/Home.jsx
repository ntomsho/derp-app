import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './signup_form';
import SignInForm from './login_form';

export default function Home() {
    
    const sessionForms = () => {
        if (!window.currentUser) {
            return (
                <div>
                    <h3>Returning?</h3>
                    <SignInForm />
                    <br/>
                    <h3>Create Account</h3>
                    <SignUpForm />
                </div>
            )
        }
    }
    
    return (
        <div id="home-container">
            {window.currentUser ? 
                <Link to="/ged">
                    <button id="dnd-button">
                        <h3>GED</h3> <br /> Guild of Expendable Dungeoneers
                    </button>
                </Link> :
                sessionForms()}
        </div>
    )
}