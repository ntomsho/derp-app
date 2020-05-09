import React from 'react';
import Toast from 'react-bootstrap/Toast';

const GameToast = (props) => {

    const messageText = (message) => {
        const key = Object.keys(message).filter(x => x !== "charId")[0];
        switch (key) {
            case 'health':
                return message[key] > 0 ?
                `${props.charName} regained ${message[key]} health.` :
                `${props.charName} took ${message[key]} damage.`
            case 'plot_points':
                return message[key] > 0 ?
                    `${props.charName} gained a Derp Point.` :
                    `${props.charName} lost a Derp Point.`
            case 'gain_item':
                return `${props.charName} has gained an item: ${message[key].item}`
            case 'lose_item':
                return `${props.charName} lost their ${message[key].string}`
            case 'lose_resource':
                return `${props.charName} lost one of their ${message[key].ind[0]}: ${message[key].string}`
            case 'change_clock':
                return `${message[key].title} has ${message[key].diff > 0 ? "advanced" : "decreased"} by ${message[key].diff} to ${message[key].progress}`
            case 'new_clock':
                return `New ${message[key].category} Clock: ${message[key].title} starting at ${message[key].progress} out of ${message[key].size}`
            case 'clear_clock':
                return `The ${message[key].category} Clock: ${message[key].title} was cleared. It was ${message[key].completed ? 'completed' : 'not completed'}`
            case 'login':
                return `${message.login.username} has logged in as ${message.login.characterName}.`
            case 'logout':
                return `${message.logout.username} has logged out.`
            default:
                return;
        }
    }

    return (
        <Toast style={{opacity: '85%'}} onClose={() => props.removeNote(props.ind)} show delay={5000} autohide>
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