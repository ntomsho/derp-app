import React, {useState, useEffect} from 'react';
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
    const [endingDate, setEndingDate] = useState(new Date());

    useEffect(() => {
        if (startDate.getTime() > endingDate.getTime()) {
            setEndingDate(new Date(startDate));
        }
    }, [startDate])

    function scheduleGame() {
        if (startDate && endingDate.getTime() >= startDate.getTime()) {
            const newGame = { title, description, campaign_id: props.campaignId, start_time: startDate, end_time: endingDate };
            createChapter(newGame, props.addNewGame);
            setScheduling(false);
        }
    }

    function dateObj(date) {
        return {
            'date': date.toDateString(),
            'timeZone': date.toTimeString().slice(18),
            'time': date.toLocaleTimeString().replace(":00", "")
        }
    }

    function nextGameDisp() {
        const today = new Date();
        let gameDisp;
        if (props.currentGame) {
            let startTime;
            let endTime;
            if (props.currentGame.start_time) startTime = dateObj(new Date(props.currentGame.start_time));
            if (props.currentGame.end_time) endTime = dateObj(new Date(props.currentGame.end_time));
            gameDisp = (
                <>
                    <div className="grenze">{new Date(props.currentGame.end_time).getTime() < today.getTime() ? "Next Game:" : "Current Game:"}</div>
                    <h3>{props.currentGame.title}</h3>
                    <em>{props.currentGame.description}</em>
                    {startTime ? <div><strong>From </strong>{startTime.date}</div> : null}
                    {startTime ? <div>{startTime.time + " " + startTime.timeZone}</div> : null}
                    {endTime ? <div><strong>To </strong>{endTime.date}</div> : null}
                    {endTime ? <div>{endTime.time}</div> : null}
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
                    <Button className="mb-3" onClick={() => setScheduling(true)}>Schedule Next Game</Button>
                )
            }
            const today = new Date();
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
                            minDate={today}
                            maxDate={new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())}
                            timeFormat="h:mm aa"
                            timeIntervals={5}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </Col>
                    <Col xs={6}>
                        <Form.Label className="grenze">Expected End Time</Form.Label>
                        <DatePicker
                            selected={endingDate}
                            onChange={date => setEndingDate(date)}
                            showTimeSelect
                            minDate={startDate}
                            maxDate={new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())}
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

    function joinButton() {
        if (props.currentGame && props.subbed) {
            return <Button size="lg"><Link to={`/ged/games/${props.currentGame.id}`}>Join Game</Link></Button>
        }
    }

    return (
        <>
        <Row className="mb-3">
            <Col xs={6}>
                {nextGameDisp()}
            </Col>
            <Col className="d-flex align-items-center">
                {joinButton()}
            </Col>
        </Row>
        {createGameForm()}
        </>
    )

}

export default GameDisplay;