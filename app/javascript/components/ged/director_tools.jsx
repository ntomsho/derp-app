import React from 'react';
import * as tables from '../../dndb-tables';
import DirectorToolsList from './director_tools_list';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class DirectorTools extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: {
                options: {'limit': 1, 'type': 'equipment'},
                list: []
            },
            creatures: {
                options: {'limit': 1, 'base': 'random', 'mutations': '1'},
                list: []
            },
            npcs: {
                options: {'limit': 1, 'race': 'random'},
                list: []
            }
        }
        this.update = this.update.bind(this);
        this.numberOptions = this.numberOptions.bind(this);
        this.getItems = this.getItems.bind(this);
        this.giveItem = this.giveItem.bind(this);
        this.getCreatures = this.getCreatures.bind(this);
        this.creatureString = this.creatureString.bind(this);
        this.getNpcs = this.getNpcs.bind(this);
    }

    update(e) {
        let newState = Object.assign({}, this.state)
        const category = e.currentTarget.name.split("-");
        newState[category[0]].options[category[1]] = parseInt(e.currentTarget.value) || e.currentTarget.value;
        this.setState(newState);
    }
    
    numberOptions() {
        let options = [];
        for (let i = 1; i <= 6; i++) {
            options.push(<option key={i} value={i}>{i}</option>)
        }
        return options;
    }

    getItems(e) {
        e.preventDefault();
        let newState = this.state.items;
        let newItems = [];
        let itemSource;
        switch(this.state.items.options.type) {
            case 'equipment':
                itemSource = () => tables.random(tables.EQUIPMENT);
                break;
            case 'magic':
                itemSource = tables.randomMagicItem;
                break;
            case 'trinket':
                itemSource = () => tables.random(tables.TRINKETS);
                break;
            default:
                itemsource = tables.randomTreasureItem;
        }
        for (let i = 0; i < this.state.items.options.limit; i++) {
            newItems.push(itemSource())
        }
        newState.list = newItems;
        this.setState({ items: newState });
    }

    getCreatures(e) {
        e.preventDefault();
        const animalMethods = { "random": () => tables.randomAnimal(), "aerial": () => tables.random(tables.AERIAL_CREATURES), 'aquatic': () => tables.random(tables.AQUATIC_CREATURES),
            "bug": () => tables.random(tables.BUG_CREATURES), "predator": () => tables.random(tables.PREDATOR_CREATURES), "prey": () => tables.random(tables.PREY_CREATURES),
            "domesticated": () => tables.random(tables.DOMESTICATED_CREATURES) }
        const mutationMethods = { "0": () => "", "1": () => [tables.random(tables.MUTATIONS)], "2": () => [tables.random(tables.MUTATIONS), tables.random(tables.MUTATIONS)],
            "hybrid": () => `${randomAnimal()} feature` }
        let newState = this.state.creatures;
        let newCreatures = [];
        const animalSource = animalMethods[this.state.creatures.options['base']];
        const mutationSource = mutationMethods[this.state.creatures.options['mutations']];
        for (let i = 0; i < this.state.creatures.options.limit; i++) {
            newCreatures.push(this.creatureString(animalSource(), mutationSource()))
        }
        newState.list = newCreatures;
        this.setState({ creatures: newState })
    }

    creatureString(base, mutations) {
        if (mutations.length === 0) {
            return base;
        } else {
            if (tables.ADJECTIVE_MUTATIONS.includes(mutations[0])) {
                if (mutations.length === 2) {
                    if (tables.ADJECTIVE_MUTATIONS.includes(mutations[1])) {
                        return mutations[0] + ", " + mutations[1] + " " + base;
                    } else {
                        return mutations[0] + " " + base + " with " + mutations[1]
                    }
                } else {
                    return mutations[0] + " " + base;
                }
            } else {
                if (mutations.length === 2) {
                    if (tables.ADJECTIVE_MUTATIONS.includes(mutations[1])) {
                        return mutations[1] + " " + base + " with " + mutations[0];
                    } else {
                        return base + " with " + mutations[0] + " and " + mutations[1];
                    }
                } else {
                    return base + " with " + mutations[0]
                }
            }
        }
    }

    getNpcs(e) {
        e.preventDefault();
        let newState = this.state.npcs;
        let newNpcs = [];
        for (let i = 0; i < this.state.npcs.options.limit; i++) {
            newNpcs.push(this.generateNpc(this.state.npcs.options.race))
        }
        newState.list = newNpcs;
        this.setState({ npcs: newState });
    }

    generateNpc(race) {
        const raceMethods = { 'random': () => tables.randomRace(), 'human': () => "Human", 'nonhuman': () => [tables.random(tables.RACE_TRAITS), tables.random(tables.RACE_TRAITS)] }
        let raceString = raceMethods[race]();
        if (Array.isArray(raceString)) raceString = raceString.join(" and ");
        return (
            <div className="d-flex flex-column">
            <div><strong>Race Traits:</strong> {raceString}</div>
            <div><strong>Background:</strong> {tables.random(tables.BACKGROUNDS)}</div>
            <div><strong>Appearance:</strong> {tables.random(tables.APPEARANCES)}</div>
            <div><strong>Derp:</strong> {tables.random(tables.DERPS)}</div>
            </div>
        )
    }

    giveItem(charId, item) {
        let newState = Object.assign({}, this.props.characters);
        let inv = newState[charId].character.inventory
        inv = JSON.parse(inv);
        for (let i = 0; i < inv.length; i++) {
            if (!inv[i]) inv[i] = item
        }
        newState[charId].character.inventory = JSON.stringify(inv);
        this.props.charChange(newState, { 'charId': charId, 'gain_item': { item: item } });
    }

    render() {
        return (
            <>
            <Row><h3>Items</h3></Row>
            <Form className="d-flex w-100" onSubmit={this.getItems}>
                <Row className="w-100">
                <Col xs={3} md={2} className="mb-2">
                    <Form.Label className="grenze">Number</Form.Label>
                    <Form.Control as="select" name="items-limit" value={this.state.items.options['limit']} onChange={this.update}>
                        {this.numberOptions()}
                    </Form.Control>
                </Col>
                <Col xs={6} md={3}>
                    <Form.Label className="grenze">Item Type</Form.Label>
                    <Form.Control as="select" name="items-type" value={this.state.items.options['type']} onChange={this.update}>
                        <option value="equipment">Equipment</option>
                        <option value='magic'>Magic Item</option>
                        <option value='trinket'>Trinket</option>
                        <option value='treasure'>Treasure</option>
                    </Form.Control>
                </Col>
                <Col xs={5} md={3} className="d-flex align-items-end mb-2">
                    <Form.Control as={Button} type="submit">Get Items</Form.Control>
                </Col>
                <Col xs={5} md={3} className="d-flex align-items-end mb-2">
                    <Button variant="secondary" onClick={() => this.setState({ items: {options: this.state.items.options, list: []} })}>Clear</Button>
                </Col>
                </Row>
            </Form>
            <DirectorToolsList characters={this.props.characters} give={this.giveItem} list={this.state.items.list} />
            
            <Row><h3>Creatures</h3></Row>
            <Form className="d-flex w-100" onSubmit={this.getCreatures}>
                <Row className="w-100">
                <Col xs={3} md={2} className="mb-2">
                    <Form.Label className="grenze">Number</Form.Label>
                    <Form.Control as="select" name="creatures-limit" value={this.state.creatures.options['limit']} onChange={this.update}>
                        {this.numberOptions()}
                    </Form.Control>
                </Col>
                <Col xs={4}>
                    <Form.Label className="grenze">Base Type</Form.Label>
                    <Form.Control as="select" name="creatures-base" value={this.state.creatures.options['base']} onChange={this.update}>
                        <option value="random">Random Animal</option>
                        <option value="aerial">Aerial Animal</option>
                        <option value="aquatic">Aquatic Animal</option>
                        <option value="bug">Bug</option>
                        <option value="predator">Predator Animal</option>
                        <option value="prey">Prey Animal</option>
                        <option value="domesticated">Domesticated Animal</option>
                    </Form.Control>
                </Col>
                <Col xs={4}>
                    <Form.Label className="grenze">Mutations</Form.Label>
                    <Form.Control as="select" name="creatures-mutations" value={this.state.creatures.options['mutations']} onChange={this.update}>
                        <option value="1">One Mutation</option>
                        <option value="2">Two Mutations</option>
                        <option value="0">No Mutations</option>
                        <option value="hybrid">Hybrid Feature</option>
                    </Form.Control>
                </Col>
                <Col xs={5} md={3} className="d-flex align-items-end mb-2">
                    <Form.Control as={Button} type="submit">Get Creatures</Form.Control>
                </Col>
                <Col xs={5} md={3} className="d-flex align-items-end mb-2">
                    <Button variant="secondary" onClick={() => this.setState({ creatures: { options: this.state.creatures.options, list: [] } })}>Clear</Button>
                </Col>
                </Row>
            </Form>
            <DirectorToolsList characters={this.props.characters} list={this.state.creatures.list} />

            <Row><h3>NPCs</h3></Row>
            <Form className="d-flex w-100" onSubmit={this.getNpcs}>
                <Row className="w-100">
                    <Col xs={3} md={2} className="mb-2">
                        <Form.Label className="grenze">Number</Form.Label>
                        <Form.Control as="select" name="npcs-limit" value={this.state.npcs.options['limit']} onChange={this.update}>
                            {this.numberOptions()}
                        </Form.Control>
                    </Col>
                    <Col xs={6} md={3}>
                        <Form.Label className="grenze">Race</Form.Label>
                        <Form.Control as="select" name="npcs-race" value={this.state.npcs.options['race']} onChange={this.update}>
                            <option value="random">Random</option>
                            <option value="human">Human</option>
                            <option value="nonhuman">Non-human</option>
                        </Form.Control>
                    </Col>
                    <Col xs={5} md={3} className="d-flex align-items-end mb-2">
                        <Form.Control as={Button} type="submit">Get NPCs</Form.Control>
                    </Col>
                    <Col xs={5} md={3} className="d-flex align-items-end mb-2">
                        <Button variant="secondary" onClick={() => this.setState({ npcs: { options: this.state.npcs.options, list: [] } })}>Clear</Button>
                    </Col>
                </Row>
            </Form>
            <DirectorToolsList characters={this.props.characters} list={this.state.npcs.list} />
            </>
        )
    }
}

export default DirectorTools;