import React from 'react';
import SessionForm from './session_form';
import { signin } from '../actions/session_actions';

const SignInForm = () => {
    return (
        <SessionForm formType="Login" processForm={signin} />
    )
}

export default SignInForm;