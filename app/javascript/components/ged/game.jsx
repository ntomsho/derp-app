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
            game: {
                counter: 1,
                messages: [],
                characters: {}
            }
        }
        this.handleReceived = this.handleReceived.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.cable = actionCable.createConsumer(API_WS_ROOT);
    }

    componentDidMount() {
        // fetchChapter()
        this.cable.subscriptions.create({
            channel: "GameChannel",
            game_id: this.props.match.params.id
        },
        {
            received: (newMessage) => this.handleReceived(newMessage),
            speak: function(message) {
                debugger
                return this.perform("speak", message)
            }
        })
    }

    sendMessage() {
        debugger
        // broadcastToChapter({ message: this.state.testMessage, game_id: this.props.match.params.id })
        this.cable.subscriptions.subscriptions[0].speak({ message: this.state.testMessage });
    }

    handleReceived(response) {
        debugger
        let newMessages = Object.assign([], this.state.game.messages);
        newMessages.push(response);
        this.setState({ game: { messages: newMessages } });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Button onClick={this.sendMessage}>Send #{this.state.game.counter}</Button>
                    </Col>
                </Row>
                <Row>
                    <h2>Messages</h2>
                </Row>
                <Row>
                    <Col>
                        {this.state.game.messages.map((message, i) => {
                            return (
                                <div key={i}>{JSON.stringify(message)}</div>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default Game;