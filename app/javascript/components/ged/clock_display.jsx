import React, {useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ClockDisplay = (props) => {

    const [changeForm, setChangeForm] = useState(0);

    function barVariant() {
        if (props.complete) {
            if (props.challenge === "derp") return "warning"
            return props.challenge ? "success" : "danger";
        } else {
            if (props.challenge === "derp") return "secondary"
            return props.challenge ? "info" : "warning";
        }
    }

    function update(e) {
        let newValue = changeForm;
        newValue = e.currentTarget.value.replace(/\D/, '');
        setChangeForm(newValue);
    }

    function processChange(value) {
        let diff = value;
        if (props.clock.progress + diff < 0) diff = props.clock.progress;
        if (props.clock.progress + diff > props.clock.size) diff = props.clock.size - props.clock.progress;
        if (diff !== 0) {
            props.sendChange(props.challenge, props.i, diff)
        }
    }

    function changeButtons() {
        if (!props.complete && !props.player) {
            return (
                <InputGroup.Append>
                    <Form.Control style={{ width: '75px', textAlign: 'center' }} value={changeForm} name={props.i} onChange={update} onFocus={(e) => e.target.select()} />
                    <Button variant="outline-success" onClick={() => processChange(parseInt(changeForm))}>+</Button>
                    <Button variant="outline-danger" onClick={() => processChange(parseInt(changeForm) * -1)}>-</Button>
                </InputGroup.Append>
            )
        }
    }

    function clearButton() {
        if (!props.player) {
            return (
                <Button disabled={(props.challenge === "derp" && !props.complete)} variant={props.challenge === "derp" ? "outline-warning" : props.complete ? barVariant() : "secondary"} onClick={() => props.clearClock(props.challenge, props.i)}>{props.challenge === "derp" ? "Distribute" : "Clear"}</Button>
            )
        }
    }

    return (
        <ListGroup.Item>
            <div className="d-flex justify-content-between mb-3">
                <h3>{props.clock.title}</h3>
                {changeButtons()}
            </div>
            <InputGroup className="mb-2">
                <InputGroup.Prepend className="w-25">
                    {clearButton()}
                </InputGroup.Prepend>
                <ProgressBar className="w-75" style={{ height: '38px' }} variant={barVariant()} now={Math.floor((props.clock.progress / props.clock.size) * 100)} />
                <span style={{ left: '25%' }} className="position-absolute w-75 text-center"><h3>{props.clock.progress} / {props.clock.size}</h3></span>
            </InputGroup>
        </ListGroup.Item>
    )

}

export default ClockDisplay;