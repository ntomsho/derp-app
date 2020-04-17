import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory, useLocation } from 'react-router-dom';

const SessionForm = (props) => {

    const history = useHistory();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const csrf_token = $("meta[name='csrf-token']").attr("content");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = Object.assign({}, {email: email, username: username, password: password});
        props.processForm(user, props.setLoggedIn);
    }

    const update = (stateSetter) => {
        return e => {
            stateSetter(e.currentTarget.value);
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
        <Form className="w-100">
            <Form.Group>
                <Form.Control type="email" value={email} placeholder="Email" onChange={update(setEmail)} className="session-input" />
            </Form.Group>
            {usernameField()}
            <Form.Group>
                <Form.Control type="password" value={password} placeholder="Password" onChange={update(setPassword)} className="session-input" />
            </Form.Group>
            <Button onClick={handleSubmit} variant="light" className="border rounded form-submit-button">{props.formType}</Button>
        </Form>
    )

}

export default SessionForm;