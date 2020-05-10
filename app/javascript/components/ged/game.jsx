import React from 'react';
import GameCharacters from './game_characters';
import GameClocks from './game_clocks';
import DirectorTools from './director_tools';
import GameToast from './game_toast';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { fetchChapter } from '../../actions/chapter_actions';
import actionCable from 'actioncable';
import { API_WS_ROOT } from '../../channels/index';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            gameState: {
                characters: {},
                clocks: {
                    challenges: [],
                    countdowns: []
                }
            }
        }
        this.handleReceived = this.handleReceived.bind(this);
        this.sendChange = this.sendChange.bind(this);
        this.charChange = this.charChange.bind(this);
        this.clockChange = this.clockChange.bind(this);
        this.processMessage = this.processMessage.bind(this);
        this.removeNote = this.removeNote.bind(this);
        this.cable = actionCable.createConsumer(API_WS_ROOT);
    }

    componentDidMount() {
        // fetchChapter()
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

    charChange(newState, change) {
        const state = Object.assign({}, this.state.gameState);
        state.characters = newState;
        this.sendChange(state, change);
    }

    clockChange(newState, change) {
        const state = Object.assign({}, this.state.gameState);
        state.clocks = newState;
        this.sendChange(state, change)
    }

    handleReceived(response) {
        let newState = Object.assign(this.state.gameState, response.state);
        this.setState({ gameState: newState });
        this.processMessage(response.message);
    }

    processMessage(message) {
        let newNotes = Object.assign([], this.state.notifications);
        newNotes.push(message);
        this.setState({ notifications: newNotes });
    }

    removeNote(ind) {
        let newNotes = Object.assign([], this.state.notifications);
        newNotes.splice(ind, 1);
        this.setState({ notifications: newNotes });
    }

    render() {
        
        //Add conditional to redirect users who aren't in the campaign
        const chars = this.state.gameState.characters;

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
                        <GameCharacters characters={this.state.gameState.characters} charChange={this.charChange} />
                    </Tab>
                    <Tab eventKey="1" title={<h2>Clocks</h2>}>
                        <GameClocks clocks={this.state.gameState.clocks} clockChange={this.clockChange} />
                    </Tab>
                    <Tab eventKey="2" title={<h2>Tools</h2>}>
                        <DirectorTools characters={this.state.gameState.characters} charChange={this.charChange} />
                    </Tab>
                </Tabs>
            </Container>
        )
    }

}

export default Game;