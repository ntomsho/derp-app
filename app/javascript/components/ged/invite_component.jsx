import React, { useState } from 'react';

const InviteComponent = (props) => {
    const [query, setQuery] = useState("");
    let searchNum = 0;

    const update = () => {
        return e => {
            setQuery(e.currentTarget.value)
        }
    }
    
    return (
        <div id="campaign-new-background">
            <div>Invite players to your campaign</div>
            <input type="text" value={query} onChange={update} />
            <div>
                <ul>
                    {props.users.map(user => {
                        if (searchNum <= 5 && user.id !== window.currentUser.id && user.username.startsWith(query)) {
                            searchNum += 1;
                            return (
                                <li key={user.id} type="button" onClick={() => selector(user)}>
                                    {user.username}
                                </li>
                            )
                        }
                    })}
                </ul>
            </div>
        </div>
    )
}

export default InviteComponent;
