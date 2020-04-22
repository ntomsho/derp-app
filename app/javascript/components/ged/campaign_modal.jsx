import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
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
                <Modal.Title>
                    Current Campaign: {props.campaignTitle || "None"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <InputGroup>
                        <InputGroup.Prepend><InputGroup.Text>Campaign</InputGroup.Text></InputGroup.Prepend>
                        <Form.Control as="select" name="campaignId" value={props.campaignId} onChange={handleChange}>
                            {campaignsList.map(campaign => {
                                return (
                                    <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                                )
                            })}
                        </Form.Control>
                    </InputGroup>
                </Form>
            </Modal.Body>
        </Modal>
    )

}

export default CampaignModal;