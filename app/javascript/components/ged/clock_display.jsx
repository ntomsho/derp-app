import React, {useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ClockDisplay = (props) => {

    const [changeForm, setChangeForm] = useState("");

    function barVariant() {
        if (props.complete) {
            return props.challenge ? "success" : "danger";
        } else {
            return props.challenge ? "info" : "warning";
        }
    }

    function update(e) {
        let newValue = changeForm;
        newValue = e.currentTarget.value.replace(/\D/, '');
        setChangeForm(newValue);
    }

    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between mb-3">
                <h3>{props.clock.title}</h3>
                <InputGroup.Append>
                    <Form.Control style={{ width: '75px', textAlign: 'center' }} value={changeForm} name={props.i} onChange={update} />
                    <Button variant="outline-success" onClick={() => props.sendChange(props.challenge, props.i, parseInt(changeForm))}>+</Button>
                    <Button variant="outline-danger" onClick={() => props.sendChange(props.challenge, props.i, parseInt(changeForm) * -1)}>-</Button>
                </InputGroup.Append>
            </div>
            <InputGroup className="mb-2">
                <InputGroup.Prepend className="w-25">
                    <Button variant="secondary" onClick={() => props.clearClock(props.challenge, props.i)}>Clear</Button>
                </InputGroup.Prepend>
                <ProgressBar className="w-75" style={{ height: '38px' }} variant={barVariant()} now={Math.floor((props.clock.progress / props.clock.size) * 100)} />
                <span style={{ left: '25%' }} className="position-absolute w-75 text-center"><h3>{props.clock.progress} / {props.clock.size}</h3></span>
            </InputGroup>
        </ListGroup.Item>
    )

}

export default ClockDisplay;