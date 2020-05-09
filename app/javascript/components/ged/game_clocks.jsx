import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import NewClockForm from './new_clock_form';

const GameClocks = (props) => {
    //Clock format: { title, type, size, progress }
    const [challengeForms, setChallengeForms] = useState({});
    const [countdownForms, setCountdownForms] = useState({});

    function createClock(clock, challenge) {
        let newClocks = Object.assign({}, props.clocks);
        const category = challenge ? "challenges" : "countdowns";
        newClockForm.challenges.push(clock);
        props.clockChange(newClocks, { new_clock: { category: challenge ? "Challenge" : "Countdown", title: clock.title, progress: clock.progress, size: clock.size } })
    }

    function updateChallengeForm(e) {
        let newClocks = Object.assign({}, challengeForms)
        newClocks[e.currentTarget.name] = e.currentTarget.value;
        setChallengeForms(newClocks)
    }

    function updateCountdownForm(e) {
        let newClocks = Object.assign({}, countdownForms)
        newClocks[e.currentTarget.name] = e.currentTarget.value;
        setCountdownForms(newClocks)
    }

    function sendChange(challenge, ind, change) {
        let newClocks = Object.assign({}, props.clocks);
        const category = challenge ? "challenges" : "countdowns";
        newClocks[category][ind].progress = newClocks[category][ind].progress + change;
        props.clockChange(newClocks, { change_clock: { diff: change, title: newClocks[category][ind].title, progress: newClocks[category][ind].progress } })
    }

    return (
        <>
        <Row><h2>Challenges</h2></Row>
        <Row>
            <ListGroup>
                {props.clocks.challenges.map((clock, i) => {
                    return (
                        <ListGroup.Item>
                            <h3>{clock.title} ({clock.size})</h3>
                            <InputGroup className="mb-2">
                                <ProgressBar style={{ height: '38px' }} variant="secondary" className="w-75" now={Math.floor((props.clocks.challenges[i].progress / props.clocks.challenges[i].size) * 100)} />
                                <span className="position-absolute w-100 text-center"><h3>{props.clocks.challenges[i].progress} / {props.clocks.challenges[i].size}</h3></span>
                                <InputGroup.Append>
                                    <Form.Control value={countdownForms[i]} name={i} onChange={updateChallengeForm} />
                                    <Button variant="outline-danger" onClick={() => sendChange(true, i, countdownForms[i].to_i)}>Advance</Button>
                                    <Button variant="outline-success" onClick={() => sendChange(true, i, countdownForms[i].to_i * -1)}>Decrease</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
            <NewClockForm challenge={true} processForm={createClock} />
        </Row>
        <Row><h2>Countdowns</h2></Row>
        <Row>

        </Row>
        </>
    )

}

export default GameClocks;