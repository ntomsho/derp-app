import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Form from 'react-bootstrap/Form';
import NewClockForm from './new_clock_form';
import ClockDisplay from './clock_display';

const GameClocks = (props) => {
    //Clock format: { title, type, size, progress }
    const [challengeForms, setChallengeForms] = useState({});
    const [countdownForms, setCountdownForms] = useState({});
    const [completedClocks, setCompletedClocks] = useState([]);

    useEffect(() => {
        let newCompletedClocks = [];
        (props.clocks.challenges.concat(props.clocks.countdowns)).forEach(clock => {
            if (clock.progress >= clock.size) newCompletedClocks.push(clock)
        })
        setCompletedClocks(newCompletedClocks);
    }, [props.clocks])

    function createClock(clock, challenge) {
        let newClocks = Object.assign({}, props.clocks);
        const category = challenge ? "challenges" : "countdowns";
        newClocks[category].push(clock);
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
        if (newClocks[category][ind].progress < 0) newClocks[category][ind].progress = 0;
        if (newClocks[category][ind].progress > newClocks[category][ind].size) newClocks[category][ind].progress = newClocks[category][ind].size;
        props.clockChange(newClocks, { change_clock: { diff: change, title: newClocks[category][ind].title, progress: newClocks[category][ind].progress } })
    }

    function clearClock(challenge, ind) {
        let newClocks = Object.assign({}, props.clocks);
        const category = challenge ? "challenges" : "countdowns";
        const completed = newClocks[category][ind].progress >= newClocks[category][ind].size;
        const change = { clear_clock: { category: challenge ? "Challenge" : "Countdown", title: newClocks[category][ind].title, completed: completed } }
        newClocks[category].splice(ind, 1);
        debugger
        props.clockChange(newClocks, change)
    }

    function completedClocksDisp() {
        return (
            <Row>
                <h2>Completed Clocks</h2>
                <ListGroup className="w-100">
                    {completedClocks.map((clock, i) => {

                    })}
                </ListGroup>
            </Row>
        )
    }

    return (
        <>
        <Row><h2>Challenges</h2></Row>
        <Row>
            <ListGroup className="w-100">
                {props.clocks.challenges.map((clock, i) => {
                    return (
                        <ClockDisplay key={i} complete={false} challenge={true} clock={clock} i={i} sendChange={sendChange} />
                        // <ListGroup.Item key={i}>
                        //     <div className="d-flex justify-content-between mb-3">
                        //         <h3>{clock.title} ({clock.size})</h3>
                        //         <InputGroup.Append className="w-25">
                        //             <Form.Control style={{ width: '75px', textAlign: 'center' }} value={countdownForms[i]} name={i} onChange={updateChallengeForm} />
                        //             <Button variant="outline-success" onClick={() => sendChange(true, i, parseInt(challengeForms[i]))}>+</Button>
                        //             <Button variant="outline-danger" onClick={() => sendChange(true, i, parseInt(challengeForms[i]) * -1)}>-</Button>
                        //         </InputGroup.Append>
                        //     </div>
                        //     <InputGroup className="mb-2">
                        //         <InputGroup.Prepend className="w-25">
                        //             <Button variant="secondary" onClick={() => clearClock(true, i)}>Clear</Button>
                        //         </InputGroup.Prepend>
                        //         <ProgressBar className="w-75" style={{ height: '38px' }} variant="info" now={Math.floor((props.clocks.challenges[i].progress / props.clocks.challenges[i].size) * 100)} />
                        //         <span style={{left: '25%'}} className="position-absolute w-75 text-center"><h3>{props.clocks.challenges[i].progress} / {props.clocks.challenges[i].size}</h3></span>
                        //     </InputGroup>
                        // </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </Row>
        <Row className="my-3">
            <NewClockForm challenge={true} processForm={createClock} />
        </Row>
        <Row><h2>Countdowns</h2></Row>
        <Row>

        </Row>
        </>
    )

}

export default GameClocks;