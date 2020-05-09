import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import NewClockForm from './new_clock_form';
import ClockDisplay from './clock_display';

const GameClocks = (props) => {
    
    const [completedClocks, setCompletedClocks] = useState({'challenges': [], 'countdowns': []});

    useEffect(() => {
        let newCompletedClocks = {'challenges': [], 'countdowns': []};
        props.clocks.challenges.forEach(clock => {
            if (clock.progress >= clock.size) newCompletedClocks.challenges.push(clock)
        })
        props.clocks.countdowns.forEach(clock => {
            if (clock.progress >= clock.size) newCompletedClocks.countdowns.push(clock)
        })
        setCompletedClocks(newCompletedClocks);
    }, [props.clocks])

    function createClock(clock, challenge) {
        let newClocks = Object.assign({}, props.clocks);
        const category = challenge ? "challenges" : "countdowns";
        newClocks[category].push(clock);
        props.clockChange(newClocks, { new_clock: { category: challenge ? "Challenge" : "Countdown", title: clock.title, progress: clock.progress, size: clock.size } })
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
        props.clockChange(newClocks, change)
    }

    function completedClocksDisp() {
        if (completedClocks.challenges.length > 0 || completedClocks.countdowns.length > 0) {
            return (
                <>
                    <Row><h2>Completed Clocks</h2></Row>
                    <ListGroup className="w-100">
                        {completedClocks.challenges.map((clock, i) => {
                            return <ClockDisplay key={i} complete={true} challenge={true} clock={clock} i={i} clearClock={clearClock} sendChange={sendChange} />
                        })}
                    </ListGroup>
                    <ListGroup className="w-100">
                        {completedClocks.countdowns.map((clock, i) => {
                            return <ClockDisplay key={i} complete={true} challenge={false} clock={clock} i={i} clearClock={clearClock} sendChange={sendChange} />
                        })}
                    </ListGroup>
                </>
            )
        }
    }

    return (
        <>
        {completedClocksDisp()}
        <Row><h2>Challenges</h2></Row>
        <Row>
            <ListGroup className="w-100">
                {props.clocks.challenges.map((clock, i) => {
                    if (clock.progress < clock.size) {
                        return <ClockDisplay key={i} complete={false} challenge={true} clock={clock} i={i} clearClock={clearClock} sendChange={sendChange} />
                    }
                })}
            </ListGroup>
        </Row>
        <Row className="my-3 justify-content-center">
            <Accordion>
                <Card>
                    <Accordion.Toggle as={Button} variant="info" className="w-100" eventKey="0">
                        Create Challenge
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <NewClockForm challenge={true} processForm={createClock} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Row>
        <Row><h2>Countdowns</h2></Row>
        <Row>
            <ListGroup className="w-100">
                {props.clocks.countdowns.map((clock, i) => {
                    if (clock.progress < clock.size) {
                        return <ClockDisplay key={i} complete={false} challenge={false} clock={clock} i={i} clearClock={clearClock} sendChange={sendChange} />
                    }
                })}
            </ListGroup>
        </Row>
        <Row className="my-3 justify-content-center">
            <Accordion>
                <Card>
                    <Accordion.Toggle as={Button} variant="warning" className="w-100" eventKey="0">
                        Create Countdown
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <NewClockForm challenge={false} processForm={createClock} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Row>
        </>
    )

}

export default GameClocks;