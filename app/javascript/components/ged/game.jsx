import React from 'react';
import GameCharacters from './game_characters';
import GameClocks from './game_clocks';
import DirectorTools from './director_tools';
import CharacterMain from './character_main';
import GameToast from './game_toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { fetchChapter } from '../../actions/chapter_actions';
import { snakeToCamel, camelToSnake } from '../../case_converter';
import actionCable from 'actioncable';
import { API_WS_ROOT } from '../../channels/index';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: null,
            notifications: [],
            characterSelection: "",
            currentPlayerCharacter: null,
            gameState: {
                characters: {},
                clocks: {
                    derp: 0,
                    challenges: [],
                    countdowns: []
                }
            }
        }
        this.handleReceived = this.handleReceived.bind(this);
        this.sendChange = this.sendChange.bind(this);
        this.charChange = this.charChange.bind(this);
        this.directorCharChange = this.directorCharChange.bind(this);
        this.setPlayerChar = this.setPlayerChar.bind(this);
        this.clockChange = this.clockChange.bind(this);
        this.processMessage = this.processMessage.bind(this);
        this.removeNote = this.removeNote.bind(this);
        this.setSelection = this.setSelection.bind(this);
        this.setCharacter = this.setCharacter.bind(this);
        this.characterSelect = this.characterSelect.bind(this);
        this.cable = actionCable.createConsumer(API_WS_ROOT);
    }

    componentDidMount() {
        fetchChapter(this.props.match.params.id, (game) => this.setState({game: game}))
        this.cable.subscriptions.create({
            channel: "GameChannel",
            game_id: this.props.match.params.id,
            character_id: this.props.character_id
        },
        {
            received: (response) => this.handleReceived(response),
            speak: function(message) {
                return this.perform("speak", message)
            }
        })
    }

    sendChange(newState, change) {
        this.cable.subscriptions.subscriptions[0].speak({ state: newState, change: change });
    }

    charChange(newCharState, charId, change) {
        let state = Object.assign({}, this.state.gameState);
        const JSONValues = ["raceTraits", "trainedSkills", "currentSpecials", "inventory", "advancements", "favoriteTags"];
        let newState = {};
        Object.keys(newCharState).forEach(key => {
            newState[camelToSnake(key)] = JSONValues.includes(key) ?
                JSON.stringify(newCharState[key]) :
                newCharState[key]
        });
        state.characters[charId].character = newState;
        this.sendChange(state, change);
    }

    directorCharChange(newState, change) {
        let state = Object.assign({}, this.state.gameState);
        state.characters = newState;
        this.sendChange(state, change);
    }

    setPlayerChar(char) {
        const JSONValues = ["race_traits", "trained_skills", "current_specials", "inventory", "advancements", "favorite_tags"];
        let newState = {};
        Object.keys(char).forEach(key => {
            if (key === "race_traits" && char[key] === "Human") return newState["raceTraits"] = "Human";
            JSONValues.includes(key) ?
                newState[snakeToCamel(key)] = JSON.parse(char[key]) :
                newState[snakeToCamel(key)] = char[key];
        });
        return newState;
    }

    clockChange(newState, change) {
        let state = Object.assign({}, this.state.gameState);
        state.clocks = newState;
        if (change.derp_fill) {
            Object.keys(state.characters).forEach(charId => {
                let charPoints = state.characters[charId].character.plot_points;
                if (charPoints < 3) state.characters[charId].character.plot_points++;
                let charExp = state.characters[charId].character.experience;
                if (charExp < state.characters[charId].character.level + 2) state.characters[charId].character.experience++;
            })
        }
        this.sendChange(state, change)
    }

    handleReceived(response) {
        let newState = Object.assign(this.state.gameState, response.state);
        this.setState({ gameState: newState });
        this.processMessage(response.message);
    }

    processMessage(message) {
        if (message.no_op) return;
        let newNotes = Object.assign([], this.state.notifications);
        newNotes.push(message);
        this.setState({ notifications: newNotes });
    }

    removeNote(ind) {
        let newNotes = Object.assign([], this.state.notifications);
        newNotes.splice(ind, 1);
        this.setState({ notifications: newNotes });
    }

    setSelection(e) {
        this.setState({ characterSelection: e.currentTarget.value })
    }

    setCharacter(e) {
        e.preventDefault();
        const character = this.state.characterSelection;
        this.setState({ characterSelection: null, currentPlayerCharacter: character });
    }

    characterSelect() {
        if (this.props.loggedInUser.id === this.state.game.director_id) {
            this.setState({ currentPlayerCharacter: "Director" })
            return (
                <div style={{ height: '92vh' }} className="d-flex bg-light w-100 justify-content-center align-items-center">
                    <h1>Logging In...</h1>
                    <Spinner animation="grow" role="status" variant="dark" />
                </div>
            )
        } else {
            const selectButton = this.state.characterSelection ? <Form.Control className="my-5" type="submit" as={Button}>Select Character</Form.Control> : <div style={{height: '134px', width: '1px'}}/>;
            return (
                <div style={{ height: '92vh' }} className="d-flex bg-light w-100 justify-content-center align-items-center">
                    <Form onSubmit={this.setCharacter}>
                        <Form.Label><h1>Select Character</h1></Form.Label>
                        <Form.Control as="select" value={this.state.characterSelection} onChange={this.setSelection}>
                            <option value="" />
                            {this.state.game.players[this.props.loggedInUser.id].map(char => {
                                return (
                                    <option key={char.id} value={char.id}>{char.name} Level {char.level} {char.c_class}</option>
                                )
                            })}
                        </Form.Control>
                        {selectButton}
                    </Form>
                </div>
            )
        }
    }

    render() {
        
        if (!this.state.game) {
            return (
                <div style={{ height: '92vh' }} className="d-flex bg-light w-100 justify-content-center align-items-center">
                    <h1>Loading Game...</h1>
                    <Spinner animation="grow" role="status" variant="dark" />
                </div>
            )
        }

        if (!this.state.currentPlayerCharacter) {
            return this.characterSelect();
        }

        const chars = this.state.gameState.characters;

        if (this.state.currentPlayerCharacter !== "Director") {
            return (
                <Container>
                    <div style={{ position: 'fixed', top: '40px', zIndex: 1500 }}>
                        {this.state.notifications.map((note, i) => {
                            return (
                                <GameToast key={i} charName={note.charId ? chars[note.charId].character.name : ""} note={note} ind={i} removeNote={this.removeNote} />
                            )
                        })}
                    </div>
                    <Tabs className="justify-content-around" defaultActiveKey="0">
                        <Tab eventKey="0" title={<h2>Characters</h2>}>
                            <CharacterMain loggedInUser={this.props.loggedInUser} 
                                charChange={this.charChange}
                                loadedChar={this.setPlayerChar(this.state.gameState.characters[this.state.currentPlayerCharacter].character)}
                            />
                        </Tab>
                        <Tab eventKey="1" title={<h2>Clocks</h2>}>
                            <GameClocks numPlayers={Object.keys(this.state.gameState.characters).length} 
                                clocks={this.state.gameState.clocks} clockChange={this.clockChange} 
                                player={true}
                            />
                        </Tab>
                    </Tabs>
                </Container>
            )
        }

        return (
            <Container>
                <div style={{ position: 'fixed', top: '40px', zIndex: 1500 }}>
                    {this.state.notifications.map((note, i) => {
                        return (
                            <GameToast key={i} charName={note.charId ? chars[note.charId].character.name : ""} note={note} ind={i} removeNote={this.removeNote} />
                        )
                    })}
                </div>
                <Tabs className="justify-content-around" defaultActiveKey="0">
                    <Tab eventKey="0" title={<h2>Characters</h2>}>
                        <GameCharacters characters={this.state.gameState.characters} charChange={this.directorCharChange} />
                    </Tab>
                    <Tab eventKey="1" title={<h2>Clocks</h2>}>
                        <GameClocks numPlayers={Object.keys(this.state.gameState.characters).length} clocks={this.state.gameState.clocks} clockChange={this.clockChange} />
                    </Tab>
                    <Tab eventKey="2" title={<h2>Tools</h2>}>
                        <DirectorTools characters={this.state.gameState.characters} charChange={this.directorCharChange} />
                    </Tab>
                </Tabs>
            </Container>
        )
    }

}

export default Game;