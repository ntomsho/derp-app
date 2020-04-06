import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './signup_form';

export default function Home() {
    return (
        <div id="home-container">
            <SignUpForm />
            <Link to="/ged">
                <button id="dnd-button">
                    <h3>GED</h3> <br /> Guild of Expendable Dungeoneers
                </button>
            </Link>
        </div>
    )
}