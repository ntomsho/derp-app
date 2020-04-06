import React from 'react';
import SessionForm from './session_form';
import { signup } from '../actions/session_actions';

const SignupForm = () => {
    return (
        <SessionForm formType="Sign Up" processForm={signup} />
    )
}

export default SignupForm;