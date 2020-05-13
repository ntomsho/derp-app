import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';

const GameDisplay = (props) => {

    const [startDate, setStartDate] = useState(new Date());

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
            return (
                <Row id="game-form-row">
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        showTimeSelect
                        timeFormat="h:mm aa"
                        timeIntervals={5}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
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
                {props.currentGame ? <Button size="lg"><Link to={`/ged/games/${props.props.currentGame.id}`}>Join Game</Link></Button> : null}
            </Col>
        </Row>
        {createGameForm()}
        </>
    )

}

export default GameDisplay;