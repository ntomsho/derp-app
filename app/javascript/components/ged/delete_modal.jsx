import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {deleteCharacter} from '../../actions/character_actions';

const DeleteModal = (props) => {

    const [deleted, setDeleted] = useState(false);

    const deleteThisCharacter = () => {
        deleteCharacter(props.charId, () => setDeleted(true))
    }

    if (deleted) {
        console.log('Deleted');
        return <Redirect to={props.campaignId ? `/ged/campaigns/${props.campaignId}` : '/ged'} />
    } else {
        return (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header>
                    <h1>Are you sure you want to delete {props.charName}?</h1>
                </Modal.Header>
                <Modal.Body>
                    <p>If you delete this character, they won't count towards your total characters in their campaign.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button block variant="danger" onClick={deleteThisCharacter}>Yeah, I'm sure. Get them outta here!</Button>
                    <Button block variant="secondary" onClick={props.onHide}>On second thought, let's keep them around for now.</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default DeleteModal;
