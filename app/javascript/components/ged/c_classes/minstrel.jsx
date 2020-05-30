import React, { useState, useEffect } from 'react';
import { random, SONGS, ELEMENTS, ELEMENTS_OF, GERUNDS, MUSICAL_INSTRUMENTS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Minstrel(props) {
    const { currentSpecials } = props;
    const [canSing, setCanSing] = useState(true);
    const input1 = React.createRef();
    const input2 = React.createRef();

    useEffect(() => {
        if (!currentSpecials.songs) {
            createSongsAndInstruments();
        }
    })

    function randomSong() {
        let song = random(SONGS);
        while (currentSpecials.songs.includes(song)) {
            song = random(SONGS);
        }
        return song;
    }
    
    function randomInstrument() {
        const category = random(["element", "verb"]);
        return {
            category: category,
            special: category === "element" ? random(ELEMENTS_OF) : random(GERUNDS),
            instrument: random(MUSICAL_INSTRUMENTS)
        }
    }

    function createSongsAndInstruments() {
        let songs = [];
        let instruments = [];
        for (let i = 0; i < 5; i++) {
            let song = randomSong();
            while (songs.includes(song)) {
                song = randomSong();
            }
            songs.push(song);
        };
        for (let i = 0; i < 3; i++) {
            instruments.push(randomInstrument());
        };
        props.updateState('currentSpecials', { 'songs': songs.sort(), 'instruments': instruments }, { rest: true });
    }

    function spendSong(songInd) {
        let newSongs = currentSpecials.songs;
        const lostSong = newSongs.splice(songInd, 1);
        props.updateState('currentSpecials', { 'songs': newSongs, 'instruments': currentSpecials.instruments }, { lose_resource: { ind: ['songs'], string: lostSong } });
    }

    function songEffects(song) {
        switch (song) {
            case "Aria":
            case "Ballad":
                return "Inspire or infuse with power";
            case "Groove":
            case "Hoedown":
                return "Enthrall or mesmerize";
            case "Jig":
            case "Shanty":
                return "Speed up movement";
            case "Dirge":
            case "Lullaby":
                return "Pacify or put to sleep";
            case "Power Chord":
            case "Solo":
                return "Blast of sound and force";
            case "Limerick":
            case "Rap Battle":
                return "Challenge or enrage";
            default:
                return "Custom Song";
        }
    }

    function instrumentString(instrument) {
        return instrument.category === "element" ?
            <div>{instrument.instrument} of <strong>{instrument.special}</strong></div> :
            <div><strong>{instrument.special}</strong> {instrument.instrument}</div>
    }

    function instrumentsDisp() {
        if (currentSpecials.instruments && currentSpecials.instruments.length > 0) {
            
            return (
                <>
                    <div className="grenze">Instruments</div>
                    {currentSpecials.instruments.map((instrument, i) => {
                        return (
                            <InputGroup key={i} className="my-1">
                                <InputGroup.Text className="w-75">{instrumentString(instrument)}</InputGroup.Text>
                            </InputGroup>
                        )
                    })}
                    <InputGroup className="my-1">
                        <InputGroup.Text className="w-75"><div>Sing</div></InputGroup.Text>
                        <InputGroup.Append>
                            <Button onClick={() => setCanSing(!canSing)} variant={canSing ? "success" : "secondary"}>{canSing ? "Free Song" : "End Scene"}</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </>
            )
        }
    }

    function songsDisp() {
        if (currentSpecials.songs && currentSpecials.songs.length > 0) {
            return (
                <>
                <div className="grenze">Songs</div>
                {currentSpecials.songs.map((song, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Prepend className="w-25"><InputGroup.Text className="w-100 grenze"><strong>{song}</strong></InputGroup.Text></InputGroup.Prepend>
                            <InputGroup.Text className="w-50">
                                <small>{songEffects(song)}</small>
                            </InputGroup.Text>
                            <InputGroup.Append>
                                <Button onClick={() => spendSong(i)} variant="secondary">🎵</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }

    function addCustomSong(randomize) {
        if (currentSpecials.songs.length >= 6) return;
        let newSongs = currentSpecials.songs;
        const newSong = randomize ? randomSong() : input1.current.value
        newSongs.push(newSong);
        props.updateState('currentSpecials', { 'songs': newSongs, 'instruments': currentSpecials.instruments }, { gain_resource: { category: 'Song', string: newSong } });
    }

    function addCustomInstrument(randomize) {
        let newInstruments = currentSpecials.instruments;
        const newInstrument = randomize ? randomInstrument() : input2.current.value
        newInstruments.push(newInstrument);
        props.updateState('currentSpecials', { 'songs': currentSpecials.songs, 'instruments': newInstruments }, { gain_resource: { category: 'Instrument', string: newInstrument } });
    }
    
    return (
        <Container>
            <Row>
                <em>A rockin’ magical songsmith and all-around entertainer.</em>
            </Row>
            <Row>
                <Col xs={12} md={5} className="mt-3">
                    <ClassDescription>
                        <div>Magic Ability:<br /><strong>Bard Songs</strong></div>
                        <div>Your music is magic! Whenever you rest, you recall a selection of three song genres and six magic notes.</div>
                        <div>Spend one of your notes to play a song, performing the song's effect modified by the effect of the note used.</div>
                        <div>You can also use your Skill Harmony once per scene to borrow a nearby ally's Skill Training, gaining Skill Advantage on an action using that Skill.</div>
                        <br/>
                        <strong className="grenze">Casting Skills</strong>
                        <div><strong>Believe in Yourself:</strong> Rolls for arias, ballads, jigs, shanties, power chords, and solos</div>
                        <div><strong>Creepin':</strong> Rolls for grooves, hoedowns, dirges, lullabies, limericks, and rap battles</div>
                        <br />
                        <div>Resource Item:<br/><strong>Songbooks</strong></div>
                        <div>Spend a songbook to add its song or note to your day's repertoire.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    {instrumentsDisp()}
                    {songsDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Song</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control as="select" ref={input1}>
                                {SONGS.map((song, i) => {
                                    return (
                                        <option key={i} value={song}>{song} - {songEffects(song)}</option>
                                    )
                                })}
                            </Form.Control>
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomSong(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomSong(true)}>🎲</Button>
                        </Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Instrument</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input2} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomInstrument(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomInstrument(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createSongsAndInstruments}>Rest<br/>Refresh Songs and Instruments</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}