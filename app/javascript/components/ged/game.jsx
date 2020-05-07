import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { fetchChapter, broadcastToChapter } from '../../actions/chapter_actions';
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
        const chars = this.state.gameState.characters;

        return (
            <Container>
                <Row>
                    <Col>
                        <Button onClick={this.sendChange}>Send</Button>
                    </Col>
                </Row>
                <Row>
                    <h2>Messages</h2>
                </Row>
                <Row>
                    <Col>
                        {Object.keys(chars).map(id => {
                            return (
                                <div key={chars[id]}>
                                    <h3>{chars[id]['character'].name}</h3>
                                    <div className="grenze">Played by {chars[id].username}</div>
                                    <div>Level {chars[id]['character'].level} {chars[id]['character'].c_class}</div>
                                </div>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default Game;