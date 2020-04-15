import React from 'react';
import { deleteInvite } from '../actions/invite_actions';

const NotificationsList = (props) => {

    const clearNotification = (invite_index) => {
        let newNotifications = Object.assign([], props.list);
        //Make this less awful later
        newNotifications.forEach((notification, i) => {
            if (notification.id === invite_index.id) {
                newNotifications.splice(i, 1);
            }
        });
        props.listSetter(newNotifications);
    }

    if (props.list.length > 0) {
        return (
            <div>
                <ul>
                    {props.list.map((invite, i) => {
                        if (!invite.viewed) {
                            return (
                                <li key={invite.id}>
                                    {invite.title ?
                                        <div>{invite.director} has invited you to join their campaign {invite.title}</div> :
                                        <div>{invite.username} has requested to join your campaign {invite.campaign_title}</div>
                                    }
                                    <button onClick={() => deleteInvite(invite.id, true, clearNotification)}>Accept</button>
                                    <button onClick={() => deleteInvite(invite.id, false, clearNotification)}>Reject</button>
                                </li>
                            )
                        }
                    })}
                </ul>
            </div>
        )
    } else {
        return null;
    }
}

export default NotificationsList;
