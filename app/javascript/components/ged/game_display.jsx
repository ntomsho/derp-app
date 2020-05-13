import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import { createChapter } from '../../actions/chapter_actions';

const GameDisplay = (props) => {

    const [scheduling, setScheduling] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    function scheduleGame() {
        if (startDate && endDate.getTime() > startDate.getTime()) {
            createChapter({title, description, start_date: startDate, end_date: endDate}, props.addNewGame)
        }
    }

    function nextGameDisp() {
        const today = new Date();
        let gameDisp;
        if (props.currentGame) {
            const startTime = new Date(props.currentGame.start_time);
            const endTime = new Date(props.currentGame.end_time);
            gameDisp = (
                <>
                    <div className="grenze">{endTime.getTime() < today.getTime() ? "Next Game:" : "Current Game:"}</div>
                    <h3>{props.currentGame.title}</h3>
                    <em>{props.currentGame.description}</em>
                    <div>{startTime.toDateString()}</div>
                    <div>{startTime.toTimeString()}</div>
                </>
            )
        } else {
            gameDisp = (
                <div className="grenze">No games scheduled yet</div>
            )
        }
        return gameDisp;
    }

    function createGameForm() {
        if (props.director) {
            if (!scheduling) {
                return (
                    <Button onClick={() => setScheduling(true)}>Schedule Next Game</Button>
                )
            }
            return (
                <Row className="mb-3">
                    <Col xs={12}>
                        <Form.Label className="grenze">Title</Form.Label>
                        <Form.Control value={title} onChange={e => setTitle(e.currentTarget.value)} />
                    </Col>
                    <Col xs={12}>
                        <Form.Label className="grenze">Description</Form.Label>
                        <Form.Control as="textarea" value={description} onChange={e => setDescription(e.currentTarget.value)} />
                    </Col>
                    <Col xs={6}>
                        <Form.Label className="grenze">Start Time</Form.Label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            showTimeSelect
                            minTime={new Date()}
                            timeFormat="h:mm aa"
                            timeIntervals={5}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </Col>
                    <Col xs={6}>
                        <Form.Label className="grenze">Expected End Time</Form.Label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setEndDate(date)}
                            showTimeSelect
                            minTime={startDate}
                            timeFormat="h:mm aa"
                            timeIntervals={5}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </Col>
                    <Col>
                        <Button onClick={scheduleGame}>Schedule Game</Button>
                        <Button variant="secondary" onClick={() => setScheduling(false)}>Cancel</Button>
                    </Col>
                </Row>
            )
        }
    }

    return (
        <>
        <Row className="mb-3">
            <Col xs={6}>
                {nextGameDisp()}
            </Col>
            <Col className="d-flex align-items-center">
                {props.currentGame ? <Button size="lg"><Link to={`/ged/games/${props.currentGame.id}`}>Join Game</Link></Button> : null}
            </Col>
        </Row>
        {createGameForm()}
        </>
    )

}

export default GameDisplay;