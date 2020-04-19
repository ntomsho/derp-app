import React from 'react';
import { CLASSES, random, randomRace, BACKGROUNDS, APPEARANCES, DERPS } from '../../dndb-tables';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import RulesModal from './rules_modal';
import DiceRoller from './dice_roller';
import Skills from './skills';
import ClassMain from './class_main';
import Inventory from './inventory';
import Advancement from './advancement';
import { snakeToCamel, camelToSnake } from '../../case_converter';
import { fetchCharacter, updateCharacter } from '../../actions/character_actions';

class CharacterMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rulesModal: false,
            diceRoller: false,
            char: {
                name: "",
                cClass: "",
                raceString: "Human",
                raceTraits: [],
                background: "",
                appearance: "",
                derp: "",
                health: 7,
                maxHealth: 7,
                plotPoints: 1,
                selectedFightingSkill: "",
                trainedSkills: [],
                currentSpecials: {},
                inventory: ["", "", "", "", "", "", "", "", "", "", "", ""],
                level: 1,
                experience: 0,
                advancements: [],
                savedTag: "",
                favoriteTags: [],
                rerolls: 0,
                regulation: true
            }
        }
        this.updateState = this.updateState.bind(this);
        this.loadCharacter = this.loadCharacter.bind(this);
        this.saveCharacter = this.saveCharacter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetchCharacter(this.props.match.params.id, this.loadCharacter);
    }

    loadCharacter(character) {
        const JSONValues = ["race_traits", "trained_skills", "current_specials", "inventory", "advancements", "favorite_tags"];
        let newState = {};
        Object.keys(character).forEach(key => {
            JSONValues.includes(key) ? 
                newState[snakeToCamel(key)] = JSON.parse(character[key]) : 
                newState[snakeToCamel(key)] = character[key];
        });
        //Temporary until assoc is figured out
        newState.favoriteTags = [];
        this.setState({ char: newState });
    }

    saveCharacter() {
        const JSONValues = ["raceTraits", "trainedSkills", "currentSpecials", "inventory", "advancements", "favoriteTags"];
        let newState = {};
        Object.keys(this.state.char).forEach(key => {
            newState[camelToSnake(key)] = JSONValues.includes(key) ? 
                JSON.stringify(this.state.char[key]) : 
                this.state.char[key]
        });
        updateCharacter(newState, this.props.match.params.id);
    }

    updateState(key, val) {
        let newState = Object.assign({}, this.state.char);
        newState[key] = val;
        this.setState({ char: newState });
    }

    handleChange(event) {
        if (event.target.name === "cClass") {
            let newState = Object.assign({}, char);
            newState['currentSpecials'] = {};
            newState['cClass'] = event.target.value
            this.setState({ char: newState });
        } else {
            this.updateState(event.target.name, event.target.value)
        }
    }

    updateHealth(num) {
        this.setState({ health: this.state.char.health === num ? num - 1 : num });
    }

    healthTrackerDisp() {
        const hearts = [];
        for (let i = 0; i < this.props.maxHealth; i++) {
            hearts.push(
                <div key={i}>
                <img key={i}
                    id={`heart-${i + 1}`}
                    alt="Health"
                    className="heart-container"
                    onClick={() => this.updateHealth(i + 1)}
                    src={this.state.char.health >= i + 1 ?
                        "http://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png" : 
                        "http://icons.iconarchive.com/icons/icons8/windows-8/256/Gaming-Hearts-icon.png"}
                />
                </div>
            )
        }
        return (
            <div style={{display: 'flex'}}>
                {hearts}
            </div>
        )
    }

    updatePlotPoints(num) {
        this.setState({ plotPoints: this.state.char.plotPoints === num ? num - 1 : num });
    }

    plotPointsTrackerDisp() {
        const pp = [];
        for (let i = 0; i < 3; i++) {
            pp.push(
                <span key={i}
                    id={`pp-${i + 1}`}
                    className="pp-container"
                    onClick={() => this.updatePlotPoints(i + 1)}
                >
                    {this.state.char.plotPoints >= i + 1 ? "⦿" : "⦾"}
                </span>
            )
        }
        return (
            <div style={{ display: 'flex' }}>
                {pp}
            </div>
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
        if (window.currentUser && window.currentUser.id === this.state.char.userId) {
            return (
                <NavDropdown.Item as="button" className="mx-1" variant="dark" onClick={this.saveCharacter}>Save Character</NavDropdown.Item>
            )
        }
    }

    render() {
        if (!this.state.char.name) {
            return (
                <Container className="bg-light">
                    Loading Character...
                </Container>
            )
        }
        return (
            <>
            <Navbar sticky="top" bg="light">
                <Nav className="flex-row justify-content-between">
                    <Nav.Link className="grenze" href="#main-section">Main</Nav.Link>
                    <Nav.Link className="grenze" href="#class-section">Class</Nav.Link>
                    <Nav.Link className="grenze" href="#skills-section">Skills</Nav.Link>
                    <Nav.Link className="grenze" href="#inventory-section">Inventory</Nav.Link>
                    <Nav.Link className="grenze" href="#advancement-section">Advancement</Nav.Link>
                    <NavDropdown className="grenze" title="Options">
                        <NavDropdown.Item as="button" className="mx-1" variant="dark" onClick={() => this.setState({ rulesModal: true })}>
                            Show Rules
                        </NavDropdown.Item>
                        <NavDropdown.Item as="button" className="mx-1" variant="dark" onClick={() => this.props.setRollerOut(true)}>
                            Roll Dice
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        {this.saveCharacterButton()}
                    </NavDropdown>
                    <Navbar.Toggle className="ml-auto" />
                </Nav>
            </Navbar>
            <RulesModal show={this.state.rulesModal} onHide={() => this.setState({ rulesModal: false })} />
            <DiceRoller show={this.state.diceRoller} onHide={() => this.setState({ diceRoller: false })} />
            <Container className="bg-light">
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color mb-0">GED:</h1>
                </Row>
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color">Guild of Expendable Dungeoneers</h1>
                </Row>
                <Form>
                    <Row id="main-section">
                        <Col xs={6} md={4}>
                            <Form.Label className="grenze">Name</Form.Label>
                            <Form.Control type="text" name="name" id="name-input" onChange={this.handleChange} value={this.state.char.name} />
                        </Col>
                        <Col xs={6} md={4}>
                            <Form.Label className="grenze">Class</Form.Label>
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
                        <Col xs={6} md={4}>
                            <Form.Label className="grenze">Race <span style={{ fontSize: '9px' }}>(but not in like a racist way)</span></Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="raceString" id="race-input" value={this.state.char.raceString} onChange={this.handleChange} placeholder="Name your race"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('raceString', randomRace() === "Human" ? "Human" : "")}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={4}>
                            <Form.Label className="grenze">Background</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="background" onChange={this.handleChange} value={this.state.char.background} id="background-input"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('background', random(BACKGROUNDS))}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={4}>
                            <Form.Label className="grenze">Appearance</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="appearance" onChange={this.handleChange} value={this.state.char.appearance} id="appearance-input"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('appearance', random(APPEARANCES))}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col xs={6} md={4}>
                            <Form.Label className="grenze">Derp</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="derp" onChange={this.handleChange} value={this.state.char.derp} id="derp-input"></Form.Control>
                                <InputGroup.Append>
                                    <Button variant="outline-dark" className="randomize-button" onClick={() => this.updateState('derp', random(DERPS))}>🎲</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form>

                <Row>
                    <div className="health-tracker">
                        <div className="field-header">Health</div>
                        {this.healthTrackerDisp()}
                    </div>
                    <div className="plot-points-tracker">
                        <div className="field-header">Plot Points</div>
                        {this.plotPointsTrackerDisp()}
                    </div>
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
                    <Advancement {...this.state.char} updateState={this.updateState} />
                </Row>
            </Container>
            </>
        )
    }
}

export default CharacterMain;