import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
                <Col>
                    <input type="text" value={username} placeholder="Username" onChange={update(setUsername)} className="session-input" />
                </Col>
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="session-form-box">
            {/* <Row noGutters> */}
                <Col>
                <input type="text" value={email} placeholder="Email" onChange={update(setEmail)} className="session-input" />
                </Col>
                {usernameField()}
                <Col>
                    <input type="password" value={password} placeholder="Password" onChange={update(setPassword)} className="session-input" />
                </Col>
                <Col>
                    <input type="submit" value={props.formType} className="border rounded" />
                </Col>
            {/* </Row> */}
        </form>
    )

}

export default SessionForm;