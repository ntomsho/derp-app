import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../../actions/user_actions';

const GEDHome = () => {
    const [usersList, setUsersList] = useState([]);
    const [campaignsList, setCampaignsList] = useState([]);

    const campaignsListDisp = () => {

    }

    useEffect(() => {
        fetchUsers(setUsersList);
    }, [])


    const usersListDisp = () => {
        if (usersList.length > 0) {
            return (
                <div>
                    <h2>Users</h2>
                    <ul>
                        {usersList.map((user, i) => {
                            return (
                                <li key={i}>
                                    <div>{user.username}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
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
