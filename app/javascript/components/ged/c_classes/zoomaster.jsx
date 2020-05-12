import React, {useState, useEffect} from 'react';
import { randomAnimal, random, MUTATIONS, ADJECTIVE_MUTATIONS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Zoomaster(props) {
    const { currentSpecials } = props;
    const [currentBeast, setCurrentBeast] = useState(null);
    const input1 = React.createRef();
    const input2 = React.createRef();

    useEffect(() => {
        if (!currentSpecials.beasts) {
            createBeasts();
        }
    });

    function randomBeast() {
        return {'beast': beastString(randomAnimal(), random(MUTATIONS)), 'name': ""};
    }

    function beastString(animal, mutation) {
        if (ADJECTIVE_MUTATIONS.includes(mutation)) {
            return mutation + " " + animal;
        }
        return animal + " with " + mutation;
    }

    function createBeasts() {
        let beasts = [];
        for (let i = 0; i < 3; i++) {
            beasts.push(randomBeast());
        }
        props.updateState('currentSpecials', { 'beasts': beasts }, { rest: true });
    }

    function addCustomBeast(randomize) {
        let newBeasts = currentSpecials.beasts;
        const newBeast = randomize ? randomBeast() : { 'beast': beastString(input1.current.value, input2.current.value), 'name': "" }
        newBeasts.push(newBeast)
        props.updateState('currentSpecials', {'beasts': newBeasts}, { gain_resource: { category: "Beast", string: newBeast.beast } });
    }

    function releaseBeast(beastIndex) {
        let newBeasts = Object.assign([], currentSpecials.beasts);
        setCurrentBeast(currentSpecials.beasts[beastIndex]);
        newBeasts.splice(beastIndex, 1);
        props.updateState('currentSpecials', { 'beasts': newBeasts }, { lose_resource: { ind: ['beasts'], string: beastString(currentSpecials.beasts[beastIndex]) } });
    }

    function currentBeastDisp() {
        if (currentBeast) {    
            return (
                <>
                <Row className="justify-content-center">
                    <h3>{currentBeast.name}</h3>
                    <Button size="sm" className="absolute-button-right" variant="secondary" onClick={() => setCurrentBeast(null)}>End Scene</Button>
                </Row>
                <Row className="justify-content-center">
                    <h2>{currentBeast.beast}</h2>
                </Row>
                </>
            )
        }
    }

    function changeBeastName(event) {
        let newBeasts = currentSpecials.beasts;
        newBeasts[event.target.name].name = event.target.value;
        props.updateState('currentSpecials', {'beasts': newBeasts});
    }

    function beastsDisp() {
        if (currentSpecials.beasts && currentSpecials.beasts.length > 0) {
            return (
                <>
                <div className="grenze">Beast Collection</div>
                {currentSpecials.beasts.map((beast, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-100"><strong>{beast.beast}</strong></InputGroup.Text>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Name</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control onChange={changeBeastName} name={i} value={beast.name}></Form.Control>
                                <InputGroup.Append>
                                    <Button disabled={!currentSpecials.beasts[i].name} variant="success" onClick={() => releaseBeast(i)}>Go!</Button>
                                </InputGroup.Append>
                            </InputGroup>
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
                <em>A tamer of beasts with a collection of chimeric animal companions.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Chimeric Beasts</strong></div>
                        <div>You carry a menagerie of exotic creatures frozen in tiny crystal globes. Whenever you rest, you randomly select three of them for your team for the day.</div>
                        <div>You can release each beast for one scene. It obeys your commands and you gain Magic Advantage for any roll that the beast makes or assists you with that it is particularly well suited for.</div>
                        <div>The beast returns to the wild at the end of the scene or as a Consequence if it is hurt or scared.</div>
                        <br />
                        <div>Resource Item:<br/><strong></strong></div>
                        <div>Spend an Animal Totem to add a new beast with its animal type and mutation to your current team.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    <Row className="justify-content-center">
                        <div className="grenze">Current Beast</div>
                    </Row>
                    <Row>
                        <Col className="justify-content-center">
                        {currentBeastDisp()}
                        </Col>
                    </Row>
                    {beastsDisp()}
                    <Form>
                        <Form.Label>Add Beast</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Base Animal</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input1} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Mutation</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input2} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomBeast(false, false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomBeast(true, false)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createBeasts}>Rest<br/>Refresh Beasts</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
