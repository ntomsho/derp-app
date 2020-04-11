import React from 'react';
import SessionForm from './session_form';
import { signup } from '../actions/session_actions';

const SignupForm = (props) => {
    return (
        <SessionForm formType="Sign Up" processForm={signup} setLoggedIn={props.setLoggedIn} />
    )
}

export default SignupForm;