import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {fetchCampaigns} from '../../actions/campaign_actions';

const CampaignModal = (props) => {

    const [campaignsList, setCampaignsList] = useState([]);

    useEffect(() => {
        fetchCampaigns(sortCampaigns);
    }, []);

    function sortCampaigns(campaigns) {
        let myCampaigns = [{ id: "", title: "None" }];
        if (props.campaignId) myCampaigns.unshift({ id: props.campaignId, title: props.campaignTitle })
        campaigns.forEach(campaign => {
            if (campaign.id !== props.campaignId && campaign.director.id !== window.currentUser.id && campaign.subs.some(sub => sub.user_id === window.currentUser.id)) {
                myCampaigns.push(campaign);
            };
        });
        setCampaignsList(myCampaigns);
    }

    function handleChange(e) {
        props.update(e.target.value);
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <h1>{props.campaignTitle || "No Campaign"}</h1>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label><h3>Change Campaign</h3></Form.Label>
                    <Form.Control as="select" name="campaignId" value={props.campaignId} onChange={handleChange}>
                        {campaignsList.map(campaign => {
                            return (
                                <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                            )
                        })}
                    </Form.Control>
                </Form>
            </Modal.Body>
        </Modal>
    )

}

export default CampaignModal;