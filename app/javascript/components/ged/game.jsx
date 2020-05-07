import React from 'react';
import GameCharacters from './game_characters';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { fetchChapter } from '../../actions/chapter_actions';
import actionCable from 'actioncable';
import { API_WS_ROOT } from '../../channels/index';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testMessage: {"test": 1},
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
            received: (newMessage) => this.handleReceived(newMessage),
            speak: function(message) {
                return this.perform("speak", message)
            }
        })
    }

    sendChange(change) {
        this.cable.subscriptions.subscriptions[0].speak({ change: change });
    }

    handleReceived(response) {
        let newState = Object.assign(this.state.gameState, response.state);
        this.setState({ gameState: newState });
    }

    render() {
        
        //Add conditional to redirect users who aren't in the campaign

        return (
            <Container>
                <Row>
                    <Col>
                        <Button onClick={this.sendChange}>Send</Button>
                    </Col>
                </Row>
                <GameCharacters characters={this.state.gameState.characters} sendChange={this.sendChange} />
            </Container>
        )
    }

}

export default Game;