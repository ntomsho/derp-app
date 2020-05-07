import React from 'react';
import Toast from 'react-bootstrap/Toast';

const GameToast = (props) => {

    const messageText = (message) => {
        delete message.charId;
        const key = Object.keys(message)[0];
        switch (key) {
            case 'health':
                return message[key] > 0 ?
                `${props.charName} regained ${message[key]} health.` :
                `${props.charName} took ${message[key]} damage.`
            case 'plot_points':
                return message[key] > 0 ?
                    `${props.charName} gained a Derp Point` :
                    `${props.charName} lost a Derp Point`
            case 'login':
                return `${message.login.username} has logged in as ${message.login.characterName}`
            default:
                return;
        }
    }

    return (
        <Toast style={{ opacity: '75%', position: 'fixed', top: 0, zIndex: 1500 }} onClose={() => props.removeNote(props.ind)} show delay={5000} autohide>
            <Toast.Header>
                Notification
            </Toast.Header>
            <Toast.Body>
                {messageText(props.note)}
            </Toast.Body>
        </Toast>
    )

}

export default GameToast;