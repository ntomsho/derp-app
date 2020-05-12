import React, { useState, useEffect } from 'react';
import { random, FORMS, ELEMENTS, VERBS, ELEMENTS_OF, GERUNDS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Wizcaster(props) {
    let { currentSpecials } = props;
    let { words } = currentSpecials;

    const [currentSpell, setCurrentSpell] = useState([]);
    const [keepWordInd, setKeepWordInd] = useState(null);
    const [selectedWordInd, setSelectedWordInd] = useState(null);
    const [missileUsed, setMissileUsed] = useState(props.currentSpecials.words[0].word !== "Missile");
    const input1 = React.createRef();
    const input2 = React.createRef();

    useEffect(() => {
        if (!currentSpecials.words) {
            createWords();
        }
    });

    function randomWord(type) {
        const wordCatName = type || random(["Form", "Element", "Verb"]);
        let wordCat;
        switch(wordCatName) {
            case "Form":
                wordCat = FORMS;
                break;
            case "Element":
                wordCat = ELEMENTS;
                break;
            default:
                wordCat = VERBS;
        }
        return { 'word': random(wordCat), 'wordCat': wordCatName }
    }

    function addCustomWord(randomize, missile) {
        let newWords = [...currentSpecials.words];
        let newWord;
        if (randomize) {
            newWord = randomWord()
            newWords.push(newWord);
        } else if (missile) {
            setMissileUsed(false);
            newWord = { 'word': "Missile", 'wordCat': "Form" };
            newWords.unshift(newWord);
        } else {
            newWord = { 'word': input2.current.value, 'wordCat': input1.current.value }
            newWords.push(newWord)
        }
        props.updateState('currentSpecials', {'words': newWords}, { gain_resource: { category: "Word of Power", string: `${newWord.word} (${newWord.wordCat})` } });
    }

    function createWords() {
        let newWords = [{'word': 'Missile', 'wordCat': 'Form'}];
        newWords.push(randomWord('Element'));
        newWords.push(randomWord('Verb'));
        while (newWords.length < 7) {
            newWords.push(randomWord());
        }
        setMissileUsed(false);
        setCurrentSpell([]);
        props.updateState('currentSpecials', { 'words': newWords }, { rest: true });
    }

    function addWordToSpell(start, wordInd) {
        let newSpell = currentSpell;
        if (start) {
            if (keepWordInd !== null) setKeepWordInd(keepWordInd + 1);
            newSpell.unshift(wordInd);
            setCurrentSpell([...newSpell]);
        } else {
            newSpell.push(wordInd);
            setCurrentSpell([...newSpell]);
        }
        setSelectedWordInd(null);
    }

    function removeWordFromSpell(ind) {
        let newSpell = currentSpell;
        if (ind === keepWordInd) {
            setKeepWordInd(null);
        } else if (keepWordInd > ind) {
            setKeepWordInd(keepWordInd - 1);
        }
        newSpell.splice(ind, 1);
        setCurrentSpell([...newSpell]);
    }

    function castSpell() {
        let newWords = Object.assign([], words);
        let lostWords = []
        for (let i = 0; i < currentSpell.length; i++) {
            if (words[currentSpell[i]].word === "Missile") setMissileUsed(true);
            if (currentSpell[i] !== currentSpell[keepWordInd]){
                lostWords.push(words[currentSpell[i]].word);
                newWords.splice(currentSpell[i], 1);
            }
        }
        setKeepWordInd(null);
        setSelectedWordInd(null);
        setCurrentSpell([]);
        props.updateState('currentSpecials', {'words': newWords}, { lose_resource: { ind: ['words'] , string: lostWords.join(" and ") } });
    }

    function endSceneButton() {
        if (missileUsed) {
            return (
                <Button variant="secondary" onClick={() => addCustomWord(false, true)}>End Scene</Button>
            )
        }
    }

    function wordsListDisp() {
        if (words) {
            return (
                <Col className="text-center">
                    <Row className="justify-content-center">
                        <div className="grenze">Words of Power</div>
                    </Row>
                    <Row className="justify-content-center">
                        {endSceneButton()}
                    </Row>
                    <ButtonGroup vertical>
                        {words.map((word, i) => {
                            return (
                                <Button key={i} 
                                    variant={word.word === "Missile" ? "primary" : "info"}
                                    className={`my-1 resource-list-entry wizcaster-word${selectedWordInd === i ? ' selected' : ''}`} 
                                    onClick={() => setSelectedWordInd(selectedWordInd === i ? null : i)}>
                                    <div><strong>{word.word}</strong> {word.wordCat}</div>
                                </Button>
                            )
                        })}
                    </ButtonGroup>
                </Col>
            )
        }
    }

    function currentSpellWord(word, index) {
        if (currentSpell.length >= 2 && index >= 1) {
            if (word.wordCat === "Element" && words[currentSpell[index - 1]].wordCat === "Form") {
                return (
                    <><div className="grenze">of </div><h3>{ELEMENTS_OF[ELEMENTS.indexOf(word.word)]}</h3></>
                )
            }
            if (word.wordCat === "Element" && words[currentSpell[index - 1]].wordCat === "Verb") {
                return (
                    <h3>{ELEMENTS_OF[ELEMENTS.indexOf(word.word)]}</h3>
                )
            }
            if (word.wordCat === "Verb" && words[currentSpell[index - 1]].wordCat === "Form") {
                return (
                    <><div className="grenze">of </div><h3>{GERUNDS[VERBS.indexOf(word.word)]}</h3></>
                )
            }
        }
        if (word.wordCat === "Verb") {
            return <h3>{GERUNDS[VERBS.indexOf(word.word)]}</h3>
        }
        return <h3>{word.word}</h3>
    }

    function spellAddButtonLeft() {
        if (selectedWordInd !== null && selectedWordInd < words.length && !currentSpell.includes(selectedWordInd)) {
            if (words[selectedWordInd].wordCat === "Element" && 
            currentSpell.length > 0 && 
            words[currentSpell[0]].wordCat === "Verb") {
                return (<></>)
            } else {
                if (currentSpell.length === 0) {
                    return (
                        <Col className="text-center">
                            <Button variant="secondary" onClick={() => addWordToSpell(true, selectedWordInd)}>+</Button>
                        </Col>
                    )
                } else {
                    return (
                        <Button variant="secondary" className="absolute-button-left" onClick={() => addWordToSpell(true, selectedWordInd)}>+</Button>
                    )
                }
            }
        }
    }

    function spellAddButtonRight() {
        if (selectedWordInd !== null && currentSpell.length !== 0 && !currentSpell.includes(selectedWordInd)) {
            if (words[selectedWordInd].wordCat === "Verb" && currentSpell.length > 0 && words[currentSpell[currentSpell.length - 1].wordCat === "Element"]) {
                return (<></>)
            } else {
                return (
                    <Button variant="secondary" className="absolute-button-right" onClick={() => addWordToSpell(false, selectedWordInd)}>+</Button>
                )
            }
        }
    }

    function currentSpellDisp() {
        const xsCol = [3, 4, 3];
        const mdCol = [4, 5, 3];
        return (
            <>
                {spellAddButtonLeft()}
                {currentSpell.map((wordInd, spellInd) => {
                    let keepButton;
                    if (words[wordInd].word !== "Missile") keepButton = <Button variant="outline-secondary" className={`keepword${keepWordInd === spellInd ? ' selected' : ''}`} onClick={() => setKeepWordInd(spellInd)}>Keep?</Button>
                    return (
                        <Col xs={xsCol[spellInd]} md={mdCol[spellInd]} key={spellInd} className="text-center">
                            <Row className="justify-content-center">
                                {currentSpellWord(words[wordInd], spellInd)}
                            </Row>
                            <Row className="justify-content-center">
                                <Button variant="secondary" onClick={() => removeWordFromSpell(spellInd)}>Remove</Button>
                            </Row>
                            <Row className="justify-content-center">
                                {keepButton}
                            </Row>
                        </Col>
                    )
                })}
                {spellAddButtonRight()}
            </>
        )
    }

    function castSpellButton() {
        if (currentSpell.length > 1 && keepWordInd !== null) {
            return (
                <Button size="lg" variant="secondary" className="mb-3" onClick={castSpell}>Cast Spell</Button>
            )
        }
    }

    return (
        <Container>
            <Row>
                <em>A sorcerer who combines ancient words of power to cast powerful spells.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Words of Power</strong></div>
                        <div>The Wizcaster creates magic spells by combining Words of Power. Whenever you rest, you are given six words and you can combine two or three to create that effect.</div>
                        <div>Whenever you cast a spell, you can choose one Word to keep. Any others used in the spell are lost.</div>
                        <div>You also gain the Missile Form word which can be used to build spells as normal, but cannot be kept and is restored at the end of every scene.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Scrolls of Power</strong></div>
                        <div>Spend a Scroll of Power to add its word to your current Words of Power.</div>
                        <br />
                    </ClassDescription>
                </Col>
                <Col xs={12} md={5} className="mt-3">
                    <Row className="justify-content-center">
                        <div className="grenze">Current Spell</div>
                    </Row>
                    <Row className="justify-content-center">
                        {currentSpellDisp()}
                    </Row>
                    <Row className="justify-content-center">
                        {castSpellButton()}
                    </Row>
                    {wordsListDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Word of Power</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control as="select" ref={input1}>
                                <option value="Form">Form</option>
                                <option value="Element">Element</option>
                                <option value="Verb">Verb</option>
                            </Form.Control>
                        </InputGroup>
                        <InputGroup>
                            <Form.Control ref={input2} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomWord(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomWord(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createWords}>Rest<br/>Refresh Words of Power</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}