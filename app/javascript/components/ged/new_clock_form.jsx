import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const NewClockForm = (props) => {

    const [title, setTitle] = useState("");
    const [size, setSize] = useState(props.challenge ? 4 : 2);
    const [startingProgress, setStartingProgress] = useState(0);

    useEffect(() => {
        if (startingProgress >= size) setStartingProgress(size - 1);
        if (startingProgress < 0) setStartingProgress(0);
    }, [size, startingProgress])

    function createClock() {
        const clock = { title: title, size: size, progress: startingProgress };
        props.processForm(clock, props.challenge);
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
        <Form>
            <Form.Control value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            <Form.Label value={size} onChange={(e) => setSize(e.currentTarget.value)}>Size</Form.Label>
            <Form.Control as="select">
                {sizes()}
            </Form.Control>
            <Form.Label>Starting Progress</Form.Label>
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
            <Button type="submit" onClick={createClock}>Create</Button>
        </Form>
    )

}

export default NewClockForm;