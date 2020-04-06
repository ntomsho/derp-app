import React from 'react';
import SessionForm from './session_form';
import { signup } from '../actions/session_actions';

const SignupForm = () => {
    return (
        <SessionForm formType="Login" processForm={signup} />
    )
}

export default SignupForm;