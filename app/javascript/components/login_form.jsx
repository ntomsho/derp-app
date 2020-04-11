import React from 'react';
import SessionForm from './session_form';
import { signin } from '../actions/session_actions';

const SignInForm = (props) => {
    return (
        <SessionForm formType="Login" processForm={signin} setLoggedIn={props.setLoggedIn} />
    )
}

export default SignInForm;