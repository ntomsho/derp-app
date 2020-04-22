import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeathModal = (props) => {

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Body>
                <h1 className="text-center">Seriously? You killed another one?</h1>
                <h3 className="text-center">Are you absolutely sure they're dead?</h3>
            </Modal.Body>
            <Modal.Footer>
                <Button block variant="danger" onClick={props.handleDeath}>Yeah, get the wagon.</Button>
                <Button block variant="secondary" onClick={props.onHide}>Er, no I think they're still alive.</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default DeathModal;
