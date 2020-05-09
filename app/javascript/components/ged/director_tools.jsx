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
                options: {},
                list: []
            },
            tags: {
                options: {},
                list: []
            },
            npcs: {
                options: {},
                list: []
            }
        }
        this.update = this.update.bind(this);
        this.numberOptions = this.numberOptions.bind(this);
        this.getItems = this.getItems.bind(this);
        this.giveItem = this.giveItem.bind(this);
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
                        <option value={"equipment"}>Equipment</option>
                        <option value={'magic'}>Magic Item</option>
                        <option value={'trinket'}>Trinket</option>
                        <option value={'treasure'}>Treasure</option>
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

            <Row><h3>Special Tags</h3></Row>

            <Row><h3>NPCs</h3></Row>
            </>
        )
    }
}

export default DirectorTools;