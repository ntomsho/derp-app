import React from 'react';
import * as tables from '../../../ged-tables';
import CharacterFeature from './character_feature';
import FeatureFightingStyle from './feature_fighting_style';
import FeatureMagicArtifact from './feature_magic_artifact';
import FeatureSkillMastery from './feature_skill_mastery';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class CharSheet extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            level: 1,
            rerolls: 4,
            charName: "",
            background: null,
            appearance: null,
            derp: null,
            skills: {
                fighting: {
                    "Brute Force": false,
                    "Ocular Prowess": false,
                    "Rad Moves": false
                },
                civilized: {
                    "Believe in Yourself": false,
                    "Cardio": false,
                    "Creepin\'": false,
                    "Macgyver": false,
                    "Man vs. Wild": false,
                    "Thinkiness": false
                }
            },
            features: [null, null],
            experience: 0,
            health: 7,
            armor: 0,
            derpPoints: 1,
            inventory: [],
            conditions: [],
            dead: false
        }
    }

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState[event.target.name] = event.target.value;
        this.setState(newState);
        // this.updateState(event.target.name, event.target.value);
    }

    updateHealth(num) {
        let newState = Object.assign({}, this.state);
        newState.health = this.state.health === num ? num - 1 : num;
        this.setState(newState);
        // this.updateState('health', this.charSource().health === num ? num - 1 : num);
    }

    healthTrackerDisp() {
        const hearts = [
            <Col xs={3} md={2} lg={1} key={0}>
                <Image
                    id="heart-0"
                    className="heart-container"
                    alt="0 Health"
                    disabled={this.charSource().dead}
                    fluid
                    onClick={() => this.setState({ deathModal: true })}
                    src={"https://icons.iconarchive.com/icons/icons8/ios7/256/Healthcare-Skull-icon.png"}
                />
            </Col>
        ];
        for (let i = 0; i < this.charSource().maxHealth; i++) {
            hearts.push(
                <Col xs={3} md={2} lg={1} key={i + 1}>
                    <Image 
                        id={`heart-${i + 1}`}
                        className="heart-container"
                        alt={`${i + 1} Health`}
                        fluid
                        onClick={() => this.updateHealth(i + 1)}
                        src={this.charSource().health >= i + 1 ?
                            "https://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png" : 
                            "https://icons.iconarchive.com/icons/icons8/windows-8/256/Gaming-Hearts-icon.png"}
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
        let newState = Object.assign({}, this.state);
        newState.derpPoints = this.state.derpPoints === num ? num - 1 : num;
        this.setState(newState);
        // this.updateState('plotPoints', this.charSource().plotPoints === num ? num - 1 : num);
    }

    plotPointsTrackerDisp() {
        const pp = [];
        for (let i = 0; i < 3; i++) {
            pp.push(
                <Col lg={2} md={3} xs={4} key={i} className="plot-point d-flex justify-content-center align-items-center" onClick={() => this.updatePlotPoints(i + 1)}>
                    <h1 key={i} id={`pp-${i + 1}`}
                    >
                        {this.charSource().plotPoints >= i + 1 ? "⦿" : "⦾"}
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

    updateFeature(obj, index, reroll) {
        let newState = Object.assign({}, this.state);
        newState.features[index] = obj;
        if (reroll) newState.rerolls--;
        this.setState(newState);
    }

    populateFeatures() {
        let features = [];
        for (let i = 0; i < 2; i++) {
            if (this.state.features[i]) {
                switch (feature[i].feature) {
                    case "Fighting Style":
                        features[i] = <FeatureFightingStyle index={i} rerolls={this.state.rerolls} feature={this.state.features[i] update=this.updateFeature} />
                        break;
                    case "Magic Artifact":
                        feature[i] = <FeatureMagicArtifact index={i} rerolls={this.state.rerolls} feature={this.state.features[i] update=this.updateFeature} />
                        break;
                    case "Skill Mastery":
                        feature[i] = <FeatureSkillMastery index={i} rerolls={this.state.rerolls} feature={this.state.features[i] update=this.updateFeature} />
                        break;
                    case "Special Ancestry":
                        feature[i] = <FeatureSpecialAncestry index={i} rerolls={this.state.rerolls} feature={this.state.features[i] update=this.updateFeature} />
                        break;
                    case "Words of Power":
                        feature[i] = <FeatureWordsOfPower index={i} rerolls={this.state.rerolls} feature={this.state.features[i] update=this.updateFeature} />
                }
            } else {
                features[i] = <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.features[i]} variant="outline-dark" onClick={() => this.randomize("feature_" + i)}>Roll</Button>
            }
        }
        return features;
    }

    randomize(field) {
        let newState = Object.assign({}, this.state);
        const table = this.getTable(field);
        if (field.slice(0,7) === "feature") {
            newState.features[parseInt(field.slice(8))] = {feature: table[Math.floor(Math.random() * table.length)]};
        } else {
            newState[field] = table[Math.floor(Math.random() * table.length)];
        }
        if (this.state[field]) {
            newState.rerolls--;
        }
        this.setState(newState);
    }

    getTable(field) {
        switch (field) {
            case "background": return tables.BACKGROUNDS
            case "appearance": return tables.APPEARANCES
            case "derp": return tables.DERPS
            case "feature_1":
            case "feature_2": return tables.CHARACTER_FEATURES
            case "weapon":
                const weaponType = tables.WEAPON_TYPES[Math.floor(Math.random() * tables.WEAPONS.length)]
                return tables.WEAPONS[weaponType]
        }
    }

    render() {
        return (
            <Container className="bg-light">
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color mb-0">GED:</h1>
                </Row>
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color">Guild of Expendable Dungeoneers</h1>
                </Row>
                <Row id="main-section" ref={this.mainRef} className="mb-3">
                    <Form>
                    <Col xs={6} md={4} className="my-1">
                        <Form.Label className="grenze mb-0">Name</Form.Label>
                        <Form.Control type="text" name="name" id="name-input" onChange={this.handleChange} value={this.state.charName} />
                    </Col>
                    </Form>
                </Row>
                <Row>
                    <Col xs={12} md={4} className="my-1">
                        <div className="grenze mb-0">Background</div>
                        <div>{this.state.background}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.background} variant="outline-dark" onClick={() => this.randomize("background")}>Roll</Button>
                    </Col>
                    <Col xs={12} md={4} className="my-1">
                        <div className="grenze mb-0">Appearance</div>
                        <div>{this.state.appearance}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.appearance} variant="outline-dark" onClick={() => this.randomize("appearance")}>Roll</Button>
                    </Col>
                    <Col xs={12} md={4} className="my-1">
                        <div className="grenze mb-0">DERP</div>
                        <div>{this.state.derp}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.derp} variant="outline-dark" onClick={() => this.randomize("derp")}>Roll</Button>
                    </Col>
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
                <Row>
                    
                </Row>
                <Row>
                    <Accordion>
                        <Accordion.Toggle as={Button} variant="light" className="w-100 grenze" eventKey="0">
                            Character Features
                        </Accordion.Toggle>
                        {this.populateFeatures()}
                    </Accordion>
                </Row>
            </Container>
        )
    }
}

export default CharSheet;