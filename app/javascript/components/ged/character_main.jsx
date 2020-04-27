import React from 'react';
import { Prompt } from 'react-router-dom';
import { CLASSES, random, randomRace, BACKGROUNDS, APPEARANCES, DERPS } from '../../dndb-tables';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Errors from '../errors';
import RulesModal from './rules_modal';
import DiceRoller from './dice_roller';
import CampaignModal from './campaign_modal';
import DeathModal from './death_modal';
import DeleteModal from './delete_modal';
import Skills from './skills';
import ClassMain from './class_main';
import Inventory from './inventory';
import Advancement from './advancement';
import { snakeToCamel, camelToSnake } from '../../case_converter';
import { fetchCharacter, updateCharacter } from '../../actions/character_actions';
import { fetchCampaign } from '../../actions/campaign_actions';

class CharacterMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            changesMade: false,
            campaignTitle: "",
            rulesModal: false,
            diceRoller: false,
            campaignModal: false,
            deathModal: false,
            deleteModal: false,
            char: null
        }
        this.updateState = this.updateState.bind(this);
        this.updateCampaign = this.updateCampaign.bind(this);
        this.loadCharacter = this.loadCharacter.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.levelUp = this.levelUp.bind(this);
        this.saveCharacter = this.saveCharacter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDeath = this.handleDeath.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem(this.props.match.params.id)) {
            const character = (JSON.parse(localStorage.getItem(this.props.match.params.id)))
            if (character.campaignId) {
                fetchCampaign(character.campaignId, (campaign) => this.setState({ campaignTitle: campaign.title, char: character }));
            }
        } else {
            fetchCharacter(this.props.match.params.id, this.loadCharacter);
        }
    }

    loadCharacter(character) {
        const JSONValues = ["race_traits", "trained_skills", "current_specials", "inventory", "advancements", "favorite_tags"];
        let newState = {};
        Object.keys(character).forEach(key => {
            JSONValues.includes(key) ? 
                newState[snakeToCamel(key)] = JSON.parse(character[key]) : 
                newState[snakeToCamel(key)] = character[key];
        });
        //Temporary until implemented
        newState.favoriteTags = [];
        if (newState.campaignId) {
            fetchCampaign(newState.campaignId, (campaign) => this.setState({ changesMade: false, campaignTitle: campaign.title, char: newState }));
        } else {
            this.setState({ changesMade: false, char: newState });
        }
    }

    setErrors(errors) {
        this.setState({ errors: errors })
    }

    levelUp(advancement) {
        let newState = Object.assign({}, this.state.char)
        newState.experience = 0;
        newState.level++;
        newState.advancements.push(advancement);
        const adv = Object.keys(advancement)[0];
        switch (adv) {
            case "health":
                newState.maxHealth += 2;
                newState.health += 2;
                break;
            case "civSkill":
                newState.maxHealth += 1;
                newState.health += 1;
                //No break here on purpose
            default:
                newState.trainedSkills.push(advancement[adv]);
        }
        this.setState({ changesMade: true, char: newState });
        localStorage.setItem(this.props.match.params.id, JSON.stringify(newState));
    }

    saveCharacter() {
        const JSONValues = ["raceTraits", "trainedSkills", "currentSpecials", "inventory", "advancements", "favoriteTags"];
        let newState = {};
        Object.keys(this.state.char).forEach(key => {
            newState[camelToSnake(key)] = JSONValues.includes(key) ? 
                JSON.stringify(this.state.char[key]) : 
                this.state.char[key]
        });
        updateCharacter(newState, this.setErrors);
        localStorage.removeItem(this.props.match.params.id);
    }

    updateState(key, val, rest) {
        let newState = Object.assign({}, this.state.char);
        newState[key] = val;
        if (rest && newState.health < newState.maxHealth) newState.health = newState.health + 1;
        this.setState({ changesMade: true, char: newState });
        localStorage.setItem(this.props.match.params.id, JSON.stringify(newState));
    }

    handleChange(event) {
        if (event.target.name === "cClass") {
            let newState = Object.assign({}, char);
            newState['currentSpecials'] = {};
            newState['cClass'] = event.target.value
            this.setState({ char: newState });
            localStorage.setItem(this.props.match.params.id, JSON.stringify(newState));
        } else {
            this.updateState(event.target.name, event.target.value)
        }
    }

    updateCampaign(campaignId) {
        let newState = Object.assign({}, this.state.char);
        if (campaignId === null) {
            newState['campaignId'] = null;
            this.setState({ campaignTitle: "", char: newState }, this.saveCharacter);
        } else {
            fetchCampaign(campaignId, (campaign) => {
                newState['campaignId'] = campaign.id;
                this.setState({ campaignTitle: campaign.title, char: newState }, this.saveCharacter);
            });
        }
    }

    handleDeath() {
        let newState = Object.assign({}, this.state.char)
        newState['dead'] = true;
        this.setState({ deathModal: false, char: newState }, this.saveCharacter());
        localStorage.removeItem(this.props.match.params.id);
    }

    updateHealth(num) {
        this.updateState('health', this.state.char.health === num ? num - 1 : num);
    }

    healthTrackerDisp() {
        const hearts = [
            <Col md={2} xs={3} key={0}>
                <Image
                    id="heart-0"
                    className="heart-container"
                    alt="0 Health"
                    disabled={this.state.char.dead}
                    fluid
                    onClick={() => this.setState({ deathModal: true })}
                    src={"http://icons.iconarchive.com/icons/icons8/ios7/256/Healthcare-Skull-icon.png"}
                />
            </Col>
        ];
        for (let i = 0; i < this.state.char.maxHealth; i++) {
            hearts.push(
                <Col md={2} xs={3} key={i + 1}>
                    <Image 
                        id={`heart-${i + 1}`}
                        className="heart-container"
                        alt={`${i + 1} Health`}
                        fluid
                        onClick={() => this.updateHealth(i + 1)}
                        src={this.state.char.health >= i + 1 ?
                            "http://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png" : 
                            "http://icons.iconarchive.com/icons/icons8/windows-8/256/Gaming-Hearts-icon.png"}
                    />
                </Col>
            )
        }
        return (
            <Row>
                {hearts}
            </Row>
        )
    }

    updatePlotPoints(num) {
        this.updateState('plotPoints', this.state.char.plotPoints === num ? num - 1 : num);
    }

    plotPointsTrackerDisp() {
        const pp = [];
        for (let i = 0; i < 3; i++) {
            pp.push(
                <Col md={3} xs={4} key={i} className="plot-point" onClick={() => this.updatePlotPoints(i + 1)}>
                    <h1 key={i} id={`pp-${i + 1}`}
                    >
                        {this.state.char.plotPoints >= i + 1 ? "⦿" : "⦾"}
                    </h1>
                </Col>
            )
        }
        return (
            <Row>
                {pp}
            </Row>
        )
    }

    rulesModal() {
        return (
            <div className="rules-modal hidden" style={{display: 'fixed'}}>
                <embed src="dndb_onesheet.pdf" style={{width: '90vw', height: '90vh'}}/>
            </div>
        )
    }

    saveCharacterButton() {
        if (!this.state.char.dead && this.props.loggedInUser.id === this.state.char.userId) {
            return (
                <NavDropdown.Item as="button" className="mx-1" variant="dark" onClick={this.saveCharacter}>Save Character</NavDropdown.Item>
            )
        }
    }

    deathHeader() {
        if (this.state.char.dead) {
            return <Row className="justify-content-center"><h3>This character is dead. Changes cannot be saved.</h3></Row>
        }
    }

    render() {
        if (!this.state.char) {
            return (
                <Container style={{height: '92vh'}} className="d-flex bg-light w-100 justify-content-center align-items-center">
                    <h1>Loading Character...</h1>
                    <Spinner animation="grow" role="status" variant="dark" />
                </Container>
            )
        }

        return (
            <>
            <Prompt message="You have changes that will be lost if you leave without saving." />
            <Navbar style={{zIndex: '999'}} sticky="top" bg="light">
                <Nav className="flex-row justify-content-between">
                    <Nav.Link className="grenze" href="#main-section">Main</Nav.Link>
                    <Nav.Link className="grenze" href="#class-section">Class</Nav.Link>
                    <Nav.Link className="grenze" href="#skills-section">Skills</Nav.Link>
                    <Nav.Link className="grenze" href="#inventory-section">Inventory</Nav.Link>
                    <Nav.Link className="grenze" href="#advancement-section">Advancement</Nav.Link>
                    <NavDropdown alignRight className="grenze" title="Options">
                        {this.saveCharacterButton()}
                        <NavDropdown.Divider />
                        <NavDropdown.Item as="button" className="mx-1" variant="dark" onClick={() => this.setState({ campaignModal: true })}>
                            Campaign: {this.state.campaignTitle || "None"}
                        </NavDropdown.Item>
                        <NavDropdown.Item as="button" className="mx-1" variant="dark" onClick={() => this.setState({ rulesModal: true })}>
                            Show Rules
                        </NavDropdown.Item>
                        <NavDropdown.Item as="button" className="mx-1" variant="dark" onClick={() => this.setState({ diceRoller: true })}>
                            Roll Dice
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as="button" className="mx-1" variant="danger" onClick={() => this.setState({ deleteModal: true })}>
                            Delete Character
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Navbar.Toggle className="ml-auto" />
                </Nav>
            </Navbar>
            <RulesModal show={this.state.rulesModal} onHide={() => this.setState({ rulesModal: false })} />
            <DiceRoller show={this.state.diceRoller} onHide={() => this.setState({ diceRoller: false })} />
            <CampaignModal show={this.state.campaignModal} onHide={() => this.setState({ campaignModal: false })} campaignId={this.state.char.campaignId} campaignTitle={this.state.campaignTitle} 
                update={this.updateCampaign} loggedInUser={this.props.loggedInUser} errors={this.state.errors} />
            <DeathModal show={this.state.deathModal} onHide={() => this.setState({ deathModal: false })} handleDeath={this.handleDeath} />
            <DeleteModal show={this.state.deleteModal} onHide={() => this.setState({ deleteModal: false })} charId={this.props.match.params.id} charName={this.state.char.name} campaignId={this.state.char.campaignId} />
            <Container className="bg-light">
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color mb-0">GED:</h1>
                </Row>
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color">Guild of Expendable Dungeoneers</h1>
                </Row>
                {this.deathHeader()}
                <Row>
                <Form>
                    <Errors errors={this.state.errors} />
                    <Row id="main-section" className="mb-3">
                        <Col xs={6} md={4} className="my-1">
                            <Form.Label className="grenze mb-0">Name</Form.Label>
                            <Form.Control type="text" name="name" id="name-input" onChange={this.handleChange} value={this.state.char.name} />
                        </Col>
                        <Col xs={6} md={4} className="my-1">
                            <Form.Label className="grenze mb-0">Class</Form.Label>
                            <InputGroup>
                                <Form.Control as="select" name="cClass" onChange={this.handleChange} value={this.state.char.cClass}>
                                    <option value="" disabled>Select Class</option>
                                    {CLASSES.map((c, i) => {
                                        return (
                                            <option key={i} value={c}>{c}</option>
                                        )
                                    })}
                                </Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.props.updateState('cClass', random(CLASSES))}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={4} className="my-1">
                            <Form.Label className="grenze mb-0">Race <span style={{ fontSize: '9px' }}>(but not in like a racist way)</span></Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="raceString" id="race-input" value={this.state.char.raceString} onChange={this.handleChange} placeholder="Name your race"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('raceString', randomRace() === "Human" ? "Human" : "")}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={4} className="my-1">
                            <Form.Label className="grenze mb-0">Background</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="background" onChange={this.handleChange} value={this.state.char.background} id="background-input"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('background', random(BACKGROUNDS))}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={4} className="my-1">
                            <Form.Label className="grenze mb-0">Appearance</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="appearance" onChange={this.handleChange} value={this.state.char.appearance} id="appearance-input"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('appearance', random(APPEARANCES))}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={4} className="my-1">
                            <Form.Label className="grenze mb-0">Derp</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="derp" onChange={this.handleChange} value={this.state.char.derp} id="derp-input"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('derp', random(DERPS))}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form>
                </Row>

                <Row className="mb-5">
                    <Col xs={8}>
                        <Row>
                            <div className="grenze">Health</div>
                        </Row>
                        {this.healthTrackerDisp()}
                    </Col>
                    <Col xs={4}>
                        <Row>
                            <div className="grenze">Derp Points</div>
                        </Row>
                        {this.plotPointsTrackerDisp()}
                    </Col>
                </Row>

                <Row id="class-section">
                    <ClassMain {...this.state.char} updateState={this.updateState} />
                </Row>
                <Row id="skills-section">
                    <Skills {...this.state.char} updateState={this.updateState} />
                </Row>
                <Row id="inventory-section">
                    <Inventory {...this.state.char} updateState={this.updateState} />
                </Row>
                <Row id="advancement-section">
                    <Advancement {...this.state.char} updateState={this.updateState} levelUp={this.levelUp} />
                </Row>
            </Container>
            </>
        )
    }
}

export default CharacterMain;