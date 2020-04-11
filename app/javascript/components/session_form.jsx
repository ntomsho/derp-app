import React, { useState } from 'react';

const SessionForm = (props) => {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const csrf_token = $("meta[name='csrf-token']").attr("content");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = Object.assign({}, {email: email, username: username, password: password});
        props.processForm(user);
        props.setLoggedIn(true);
    }

    const update = (stateSetter) => {
        return e => {
            stateSetter(e.currentTarget.value);
        }
    }

    const usernameField = () => {
        if (props.formType === "Sign Up") {
            return (
                <input type="text" value={username} placeholder="Username" onChange={update(setUsername)} className="session-input" />
            )
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="session-form-box">
                <input type="text" value={email} placeholder="Email" onChange={update(setEmail)} className="session-input" />
                {usernameField()}
                <input type="password" value={password} placeholder="Password" onChange={update(setPassword)} className="session-input" />
                <input type="submit" value={props.formType} className="session-submit" />
            </form>
        </div>
    )

}

export default SessionForm;