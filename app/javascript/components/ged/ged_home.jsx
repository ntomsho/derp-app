import React, { useState, useEffect } from 'react';

const GEDHome = () => {
    const [usersList, setUsersList] = useState([]);

    const fetchUsers = () => {
        return $.ajax({
            method: "GET",
            url: "api/users"
        })
    };

    useEffect(() => {
        setUsersList(fetchUsers());
    }, [])

    const usersListDisp = () => {
        if (usersList.length > 0) {
            return (
                <ul>
                    {usersList.map((user, i) => {
                        return (
                            <li key={i}>
                                <div>{user}</div>
                            </li>
                        )
                    })}
                </ul>
            )
        } else {
            return (
                <div>Loading Users...</div>
            )
        }
    }

    return (
        <div id="ged-background">
            <div>
                {usersListDisp()}
            </div>
        </div>
    )

}

export default GEDHome;
