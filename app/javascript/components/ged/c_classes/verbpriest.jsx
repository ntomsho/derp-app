import React, {useState, useEffect } from 'react';
import { random, COMMANDS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Verbpriest(props) {
    const { currentSpecials } = props;
    const [faith, setFaith] = useState(3);
    const input = React.createRef();

    useEffect(() => {
        if (!currentSpecials.words) {
            props.updateState('currentSpecials', { 'words': [] });
        }
    })

    function randomWord() {
        return random(COMMANDS);
    }

    function createWords() {
        let words = [];
        for (let i = 0; i < 4; i++) {
            let newWord = randomWord();
            while (currentSpecials.words.includes(newWord)) {
                newWord = randomWord();
            }
            words.push(randomWord());
        }
        props.updateState('currentSpecials', { 'words': words }, true);
    }

    function addCustomWord(randomize) {
        let newWords = currentSpecials.words;
        newWords.push(randomize ? randomWord() : input.current.value);
        props.updateState('currentSpecials', { 'words': newWords });
    }

    function consumeCommand(wordInd) {
        if (faith < 3) {
            setFaith(3);
            let newWords = currentSpecials.words;
            newWords.splice(wordInd, 1);
            props.updateState('currentSpecials', { 'words': newWords });
        }
    }

    function updateFaith(num) {
        setFaith(faith === num ? faith - 1 : num);
    }

    function faithDisp() {
        let buttons = [];
        for (let i = 0; i < 3; i++) {
            buttons.push(
                <Col key={i}>
                    <h1 key={i}
                    id={`faith-${i + 1}`}
                    className="faith-container"
                    onClick={() => updateFaith(i + 1)}
                    >
                        {faith >= i + 1 ? "⦿" : "⦾"}
                    </h1>
                </Col>
            )
        }
        return (
            <Row className="border border-secondary">
                {buttons}
            </Row>
        )
    }

    function wordsDisp() {
        if (currentSpecials.words) {
            return (
                <>
                <div className="grenze">Command Words</div>
                {currentSpecials.words.map((w, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-75"><strong>{w}</strong></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => consumeCommand(i)}>X</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }
    
    return (
        <Container>
            <Row>
                <div className="class-desc">A speaker of sacred words that command both living and inanimate things.</div>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Sacred Words</strong></div>
                        <div>Whenever you rest, you recall 4 Words of Power in the ancient language of the gods and your Faith is refreshed to 3.</div>
                        <div>When you speak one of the Words at a creature or object (with a target if required), spend 1 Faith and it is compelled to attempt to perform the action until completed or at least attempt to do so for a few minutes.</div>
                        <div>You can sacrifice one of your Command Words, removing it from your list, to bring your Faith back to 3.</div>
                        <div>For each of the additional bonuses below, you must spend an additional point of Faith.</div>
                        <ul>
                            <li>Adding additional words (targets, conditions, etc.) to the command</li>
                            <li>Commanding a creature that is openly hostile to you</li>
                            <li>Commanding something particularly large, powerful, complex, or magical</li>
                            <li>Making the Command last for the duration of the scene</li>
                        </ul>
                        <br/>
                        <div>Resource Item:<br/><strong>Command Scrolls</strong></div>
                        <div>Spend a Command Scroll to gain a Command with that word.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={5} className="mt-3">
                    <Row className="justify-content-center">
                        <h2>Faith</h2>
                    </Row>
                    <Row className="justify-content-center align-items-center">
                        {faithDisp()}
                    </Row>
                    {wordsDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Word</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input}></Form.Control>
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomWord(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomWord(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createWords}>Rest<br/>Refresh Command Words</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}