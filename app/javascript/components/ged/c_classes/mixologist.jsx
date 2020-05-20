import React, { useState, useEffect } from 'react';
import { random, BASES, GERUNDS, ELEMENTS, ELEMENTS_OF } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Mixologist(props) {
    let { currentSpecials } = props;
    let { bases, catalysts } = currentSpecials;

    const [keepComp, setKeepComp] = useState(null);
    const [lastClicked, setLastClicked] = useState("Base");
    //currentConcoction[0] === base;
    //currentConcoction[1] === catalyst;
    const [selectedBase, setSelectedBase] = useState(null);
    const [selectedCatalyst, setSelectedCatalyst] = useState(null);

    const input1 = React.createRef();
    const input2 = React.createRef();
    const input3 = React.createRef();

    useEffect(() => {
        if (!currentSpecials.bases && !currentSpecials.catalysts) {
            createComponents();
        }
    })

    function randomBase() {
        return random(BASES);
    }

    function randomCatalyst() {
        return random([
            {'comp': `${random(GERUNDS)}`, 'compCat': 'verb'},
            {'comp': `${random(ELEMENTS)}`, 'compCat': 'element'}
        ]);
    }

    function createComponents() {
        let newBases = [];
        let newCatalysts = [];
        for(let i = 0; i < 5; i++) {
            newBases.push(randomBase());
            newCatalysts.push(randomCatalyst());
        }
        props.updateState('currentSpecials', { 'bases': newBases, 'catalysts': newCatalysts }, { rest: true });
    }

    function addCustomComponent(randomize, compCat) {
        let newComp;
        if (compCat === "base") {
            let newBases = bases;
            newComp = randomize ? randomBase() : input1.current.value;
            newBases.push(newComp);
            props.updateState('currentSpecials', { 'bases': newBases, 'catalysts': catalysts }, { gain_resource: { ind: "bases", string: newComp } });
        } else {
            let newCatalysts = catalysts;
            if (randomize) {
                newComp = randomCatalyst();
            } else {
                newComp = {'comp': input2.current.value, 'compCat': input3.current.value};
            }
            newCatalysts.push(newComp);
            props.updateState('currentSpecials', { 'bases': bases, 'catalysts': newCatalysts }, { gain_resource: { ind: "catalysts", string: newComp.comp } });
        }
    }

    function selectComponent(category, i) {
        if (category === "Base") {
            if (selectedBase === i) {
                setKeepComp(null);
            }
            setSelectedBase(selectedBase === i ? null : i);
            setLastClicked("Base");
        } else {
            if (selectedCatalyst === i) {
                setKeepComp(null);
            }
            setSelectedCatalyst(selectedCatalyst === i ? null : i);
            setLastClicked("Catalyst");
        }
    }

    function consumeCurrentConcoction() {
        const newBases = bases;
        const newCatalysts = catalysts;
        let lostComp = {ind: keepComp === "Base" ? ["catalysts"] : ["bases"]}
        lostComp['string'] = keepComp === "Base" ?
            newCatalysts.splice(selectedCatalyst, 1).comp : 
            newBases.splice(selectedBase, 1);
        setKeepComp(null);
        setSelectedBase(null);
        setSelectedCatalyst(null);
        setLastClicked(null);
        props.updateState('currentSpecials', { 'bases': newBases, 'catalysts': newCatalysts }, { lose_resource: lostComp });
    }

    function consumeButton() {
        if (selectedBase !== null && selectedCatalyst !== null && keepComp !== null) {
            return (
                <Button size="lg" variant="secondary" onClick={consumeCurrentConcoction}>Create</Button>
            )
        }
    }

    function currentConcoctionDisp() {
        if (selectedBase !== null && selectedCatalyst === null) {
            return (
                <h3>{bases[selectedBase]}</h3>
            );
        } else if (selectedBase === null && selectedCatalyst !== null) {
            return (
                <h3>{catalysts[selectedCatalyst].comp}</h3>
            );
        } else if (selectedBase !== null && selectedCatalyst !== null) {
            const base = bases[selectedBase]
            const catalyst = catalysts[selectedCatalyst].comp
            const catalystCat = catalysts[selectedCatalyst].compCat;
            if (catalystCat === 'verb') {
                return (
                    <>
                        <Col className="text-right">
                            <h2>{catalyst} </h2>
                            <Button variant="outline-secondary" className={`keepword${keepComp === "Catalyst" ? ' selected' : ''}`} onClick={() => setKeepComp("Catalyst")}>Keep?</Button>
                        </Col>
                        <Col>
                            <h2>{base} </h2>
                            <Button variant="outline-secondary" className={`keepword${keepComp === "Base" ? ' selected' : ''}`} onClick={() => setKeepComp("Base")}>Keep?</Button>
                        </Col>
                    </>
                );
            } else {
                return lastClicked === "Base" ?
                    <>
                        <Col className="text-right">
                            <h2>{catalyst} </h2>
                            <Button variant="outline-secondary" className={`keepword${keepComp === "Catalyst" ? ' selected' : ''}`} onClick={() => setKeepComp("Catalyst")}>Keep?</Button>
                        </Col>
                        <Col>
                            <h2>{base} </h2>
                            <Button variant="outline-secondary" className={`keepword${keepComp === "Base" ? ' selected' : ''}`} onClick={() => setKeepComp("Base")}>Keep?</Button>
                        </Col>
                    </>
                    :
                    <>
                        <Col xs={5} className="text-right">
                            <h2>{base} </h2>
                            <Button variant="outline-secondary" className={`keepword${keepComp === "Base" ? ' selected' : ''}`} onClick={() => setKeepComp("Base")}>Keep?</Button>
                        </Col>
                        <Col xs={2} className="text-center">
                            <h2> of </h2>
                        </Col>
                        <Col xs={5}>
                            <h2>{ELEMENTS.includes(catalyst) ? ELEMENTS_OF[ELEMENTS.indexOf(catalyst)] : catalyst } </h2>
                            <Button variant="outline-secondary" className={`keepword${keepComp === "Catalyst" ? ' selected' : ''}`} onClick={() => setKeepComp("Catalyst")}>Keep?</Button>
                        </Col>
                    </>
            }
        }
        else {
            return <></>
        }
    }
    
    function componentsList() {
        if ((bases && bases.length > 0) || (catalysts && catalysts.length > 0)) {
            return (
                <>
                <Col className="text-center" xs={6}>
                    <div className="grenze">Bases</div>
                    <ButtonGroup vertical>
                        {bases.map((b, i) => {
                            return (
                                <Button block variant={selectedBase === i ? 'info' : 'outline-info'} key={i} className="my-1" onClick={() => selectComponent("Base", i)}>{b}</Button>
                            )
                        })}
                    </ButtonGroup>
                </Col>
                <Col className="text-center" xs={6}>
                    <div className="grenze">Catalysts</div>
                    <ButtonGroup vertical>
                        {catalysts.map((c, i) => {
                            return (
                                <Button block variant={selectedCatalyst === i ? 'warning' : 'outline-warning'} key={i} className="my-1" onClick={() => selectComponent("Catalyst", i)}>{c.comp}</Button>
                            )
                        })}
                    </ButtonGroup>
                </Col>
                </>
            )
        }
    }
    
    return (
        <Container>
            <Row>
                <em>An alchemist and apothecary who can craft a variety of useful concoctions.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Alchemical Concoctions</strong></div>
                        <div>You carry with you a supply of 5 alchemical Bases and 5 Catalysts with you that inexplicably replenishes itself when you rest.</div>
                        <div>Combine a Base and a Catalyst to create a Concoction (a process you have practiced well and can perform quickly). Select one of those components to keep, the other is expended.</div>
                        <div>Concoctions you create are inherently unstable and have to be used immediately or they will become inert. Anyone besides you who tries to use one of your Concoctions takes additional Difficulty on the roll.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Alchemical Ingredients</strong></div>
                        <div>Spend an alchemical ingredient to add it your current list of Bases or Catalysts.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={5} className="mt-3">
                    <Row className="justify-content-center">
                        <div className="grenze">Current Concoction</div>
                    </Row>
                    <Row className="justify-content-center">
                        {currentConcoctionDisp()}
                    </Row>
                    <Row className="justify-content-center">
                        {consumeButton()}
                    </Row>
                    <Row className="justify-content-center">
                        {componentsList()}
                    </Row>
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Base</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control as="select" ref={input1}>
                                {BASES.map((base, i) => {
                                    return (
                                        <option key={i} value={base}>{base}</option>
                                    )
                                })}
                            </Form.Control>
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomComponent(false, 'base')}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomComponent(true, 'base')}>🎲</Button>
                        </Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Catalyst</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input2} />
                            <Form.Control as="select" ref={input3}>
                                <option value="Element">Element</option>
                                <option value="Verb">Verb</option>
                            </Form.Control>
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomComponent(false, 'catalyst')}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomComponent(true, 'catalyst')}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={() => createComponents()}>Rest<br/>Refresh Components</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}