import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {deleteCampaign} from '../../actions/campaign_actions';

const DeleteCampaignModal = (props) => {

    const [deleted, setDeleted] = useState(false);

    const deleteThisCampaign = () => {
        deleteCampaign(props.campaignId, () => setDeleted(true))
    }

    if (deleted) {
        return <Redirect to="/ged" />
    } else {
        return (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header>
                    <h1>Are you sure you want to delete this campaign?</h1>
                </Modal.Header>
                <Modal.Body>
                    <p>If you delete this campaign, you will orphan all its characters and make all the players very sad.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button block variant="danger" onClick={deleteThisCampaign}>Yep, don't care. Shut it down!</Button>
                    <Button block variant="secondary" onClick={props.onHide}>Maybe I was being a bit hasty.</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default DeleteCampaignModal;
