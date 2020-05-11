import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const NewClockForm = (props) => {

    const [title, setTitle] = useState("");
    const [size, setSize] = useState(props.challenge ? 4 : 2);
    const [startingProgress, setStartingProgress] = useState(0);

    useEffect(() => {
        if (startingProgress >= size) setStartingProgress(size - 1);
        if (startingProgress < 0) setStartingProgress(0);
    }, [size, startingProgress])

    function createClock(e) {
        e.preventDefault();
        const clock = { title: title, size: size, progress: startingProgress };
        props.processForm(clock, props.challenge);
        setTitle("")
        setSize(props.challenge ? 4 : 2);
        setStartingProgress(0);
    }

    function sizes() {
        let options = [];
        let start = props.challenge ? 4 : 2;
        let max = props.challenge ? 12 : 6;
        let increment = props.challenge ? 2 : 1;
        for (let i = start; i <= max; i = i + increment ) {
            options.push(
                <option key={i} value={i}>{i}</option>
            )
        }
        return options;
    }

    return (
        <Form onSubmit={createClock}>
            <Row>
                <Col xs={12} className="d-flex align-items-end">
                    <InputGroup>
                        <InputGroup.Prepend className="grenze w-25">
                            New {props.challenge ? "Challenge" : "Countdown"}
                        </InputGroup.Prepend>
                        <Form.Control value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
                    </InputGroup>
                </Col>
                <Col xs={3}>
                    <Form.Label className="grenze">Size</Form.Label>
                    <Form.Control as="select" value={size} onChange={(e) => setSize(e.currentTarget.value)}>
                        {sizes()}
                    </Form.Control>
                </Col>
                <Col xs={4}>
                    <Form.Label className="grenze">Starting Progress</Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <Button variant="outline-secondary" onClick={() => setStartingProgress(startingProgress - 1)}>-</Button>
                        </InputGroup.Prepend>
                        <InputGroup.Text>
                            {startingProgress}
                        </InputGroup.Text>
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={() => setStartingProgress(startingProgress + 1)}>+</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
                <Col className="d-flex align-items-end justify-content-center">
                    <Button type="submit" size="lg">Create</Button>
                </Col>
            </Row>
        </Form>
    )

}

export default NewClockForm;