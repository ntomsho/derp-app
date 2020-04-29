import React, { useState } from 'react';
import Errors from './errors';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory, useLocation } from 'react-router-dom';

const SessionForm = (props) => {

    const [errors, setErrors] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = Object.assign({}, {email: email, username: username, password: password});
        props.processForm(user, props.setLoggedIn, setErrors);
    }

    const update = (stateSetter) => {
        return e => {
            stateSetter(e.currentTarget.value);
        }
    }

    const demoButton = () => {
        if (props.formType === "Login") {
            const demoUser = { email: 'testy1@test.com', password: 'password123' }
            return (
                <Button block className="mt-3 demo-user-xs" variant="dark" onClick={() => props.processForm(demoUser, props.setLoggedIn, setErrors)}>Sign In to Demo Account</Button>
            )
        }
    }

    const usernameField = () => {
        if (props.formType === "Sign Up") {
            return (
                <Form.Group>
                    <Form.Control type="text" value={username} placeholder="Username" onChange={update(setUsername)} className="session-input" />
                </Form.Group>
            )
        }
    }

    return (
        <>
        <Errors errors={errors} />
        <Form className="w-100">
            <Form.Group>
                <Form.Control type="email" value={email} placeholder="Email" onChange={update(setEmail)} className="session-input" />
            </Form.Group>
            {usernameField()}
            <Form.Group>
                <Form.Control type="password" value={password} placeholder="Password" onChange={update(setPassword)} className="session-input" />
            </Form.Group>
            <Button onClick={handleSubmit} variant="light" className="border rounded form-submit-button">{props.formType}</Button>
            {demoButton()}
        </Form>
        </>
    )

}

export default SessionForm;