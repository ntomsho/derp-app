import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Redirect } from 'react-router-dom';
import { CLASS_COLORS, FIGHTING_SKILLS } from '../../dndb-tables';
import { createCharacter } from '../../actions/character_actions';
import { fetchCampaigns } from '../../actions/campaign_actions'
import { camelToSnake } from '../../case_converter';

export default function CharGenConfirm(props) {
    let character = props.char;
    // Why won't this destructuring work?
    // let { character: char } = props;
    // const allSkills = character.trainedSkills;
    // if (character.selectedFightingSkill) allSkills.unshift(character.seletedFightingSkill);
    const [campaignsList, setCampaignsList] = useState([]);
    const [newCharId, setNewCharId] = useState(null);

    useEffect(() => {
        fetchCampaigns(sortCampaigns);
    }, []);

    function sortCampaigns(campaigns) {
        let myCampaigns = [{id: null, title: "None"}];
        campaigns.forEach(campaign => {
            if (campaign.director.id !== window.currentUser.id && campaign.subs.some(sub => sub.user_id === window.currentUser.id)){
                myCampaigns.push(campaign);
            };
        });
        setCampaignsList(myCampaigns);
    }

    function handleChange(event) {
        props.updateSelection(event.target.name, event.target.value);
    }

    function allTrainedSkills() {
        let allSkills = Object.assign([], character.trainedSkills);
        if (character.selectedFightingSkill) allSkills.unshift(character.selectedFightingSkill);
        return allSkills;
    }

    function raceTraits() {
        if (character.raceTraits !== "Human") {
            return (
                <ListGroup.Item>
                    <h3>Race Traits</h3>
                    <ListGroup horizontal className="d-flex flex-wrap">
                        <ListGroup.Item><div className="grenze">{character.raceTraits[0]}</div></ListGroup.Item>
                        <ListGroup.Item><div className="grenze">{character.raceTraits[1]}</div></ListGroup.Item>
                    </ListGroup>
                </ListGroup.Item>
            )
        }
    }

    function confirm() {
        if (character.name) {
            let charCopy = {};
            Object.keys(character).forEach(key => {
                if (key !== "inventoryStartingChoices") charCopy[camelToSnake(key)] = character[key];
            });
            // // charCopy.campaign_id = campaignId;
            // charCopy.campaign_id = 2;
            charCopy.health = 7;
            charCopy.plot_points = 1;
            charCopy.current_specials = {};
            charCopy.regulation = props.rerolls > 0 ? true : false;
            createCharacter(charCopy).then((newChar) => setNewCharId(newChar.id));
        }
    }

    function loadedCampaignOption() {
        if (props.campaign) {
            return (
                <option value={props.campaign.id}>{props.campaign.title}</option>
            )
        }
    }

    if (newCharId) {
        return (
            <Redirect to={`/ged/characters/${newCharId}`} />
        )
    }

    return (
        <Container>
            <Row className="mt-3 mb-1 justify-content-center">
                <Button size="lg" variant="primary" disabled={character.name === ""} onClick={confirm}>Create Character</Button>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Name: </InputGroup.Text></InputGroup.Prepend>
                            <Form.Control onChange={handleChange} type="text" name="name" value={character.name}></Form.Control>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Campaign</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control as="select" name="campaignId" value={character.campaignId} onChange={handleChange}>
                                {loadedCampaignOption()}
                                {campaignsList.map(campaign => {
                                    return (
                                        <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                                    )
                                })}
                            </Form.Control>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            <ListGroup className="mt-3">
                <ListGroup.Item>
                    <Row>
                        <Col xs={4} md={3}><h3>Class: </h3></Col><Col xs={6} style={{ color: CLASS_COLORS[character.cClass] }}><h3>{character.cClass}</h3></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col xs={4} md={3}><h3>Race: </h3></Col><Col xs={6}><h3>{character.raceString}</h3></Col>
                    </Row>
                </ListGroup.Item>
                {raceTraits()}
                <ListGroup.Item>
                    <h3>Trained Skills</h3>
                    <ListGroup horizontal>
                        {allTrainedSkills().map((skill, i) => {
                            return (
                                <ListGroup.Item variant={FIGHTING_SKILLS.includes(skill) ? "warning" : "info"} key={i}> <div className="grenze">{ skill }</div> </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col xs={6} sm={5} md={3}><h3>Background: </h3></Col><Col xs={6}><h3>{character.background}</h3></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col xs={6} sm={5} md={3}><h3>Appearance: </h3></Col><Col xs={6}><h3>{character.appearance}</h3></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col xs={6} sm={5} md={3}><h3>Derp: </h3></Col><Col xs={6}><h3>{character.derp}</h3></Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>Starting Inventory</h3>
                    <ListGroup horizontal className="d-flex flex-wrap">
                        {character.inventory.map((item, i) => {
                            return (
                                <ListGroup.Item key={i}> <div className="grenze">{item}</div> </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </Container>
    )
}