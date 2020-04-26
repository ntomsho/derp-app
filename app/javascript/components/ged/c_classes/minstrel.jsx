import React, { useState, useEffect } from 'react';
import { random, SONGS, ELEMENTS, GERUNDS } from '../../../dndb-tables';
import ClassDescription from '../class_description';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

export default function Minstrel(props) {
    const { currentSpecials } = props;
    const [skillBorrowed, setSkillBorrowed] = useState(false);
    const input1 = React.createRef();
    const input2 = React.createRef();

    useEffect(() => {
        if (!currentSpecials.songs) {
            props.updateState('currentSpecials', { 'songs': [], 'notes': [] })
        }
    })

    function randomSong() {
        let song = random(SONGS);
        while (currentSpecials.songs.includes(song)) {
            song = random(SONGS);
        }
        return song;
    }
    
    function randomNote() {
        return random([random(ELEMENTS), random(GERUNDS)])
    }

    function createSongsAndNotes() {
        let songs = [];
        let notes = [];
        for (let i = 0; i < 3; i++) {
            let ind = Math.floor(Math.random() * 6);
            while (songs.includes(ind)) {
                ind = Math.floor(Math.random() * 6);
            }
            songs.push(ind);
        };
        songs = songs.map(ind => SONGS[ind]);
        for (let i = 0; i < 6; i++) {
            notes.push(randomNote());
        };
        props.updateState('currentSpecials', { 'songs': songs.sort(), 'notes': notes }, true);
    }

    // function removeSong(songInd) {
    //     let newSongs = currentSpecials.songs;
    //     newSongs.splice(songInd, 1);
    //     props.updateState('currentSpecials', { 'songs': newSongs, 'notes': currentSpecials.notes });
    // }

    function spendNote(noteInd) {
        let newNotes = currentSpecials.notes;
        newNotes.splice(noteInd, 1);
        props.updateState('currentSpecials', { 'songs': currentSpecials.songs, 'notes': newNotes });
    }

    function songEffects(song) {
        switch (song) {
            case "Aria":
            case "Ballad":
                return "Infuse with strength/inspiration";
            case "Groove":
            case "Hoedown":
                return "Enthrall or mesmerize";
            case "Jig":
            case "Shanty":
                return "Speed up movement";
            case "Dirge":
            case "Lullaby":
                return "Pacify or put listeners to sleep";
            case "Power Chord":
            case "Solo":
                return "Create a blast of sound and force";
            default:
                return "Challenge or enrage listener";
        }
    }

    function skillHarmonyDisp() {
        return (
            <>
            <h3 className="text-center">Skill Harmony<br/>{skillBorrowed ? "Expended" : "Available"}</h3>
            <Button className="absolute-button-right" variant={skillBorrowed ? "warning" : "success"} onClick={() => setSkillBorrowed(skillBorrowed ? false : true)}>
                {skillBorrowed ? "End Scene" : "Borrow Skill"}
            </Button>
            </>
        )
    }

    function songsDisp() {
        if (currentSpecials.songs && currentSpecials.songs.length > 0) {
            return (
                <>
                <div className="grenze">Songs</div>
                {currentSpecials.songs.map((song, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-75">
                                <strong>{song}</strong>
                            </InputGroup.Text>
                            <InputGroup.Append>
                                <DropdownButton variant="secondary" title="Effect">
                                    <Dropdown.Item>{songEffects(song)}</Dropdown.Item>
                                </DropdownButton>
                            </InputGroup.Append>
                        </InputGroup>
                    )
                })}
                </>
            )
        }
    }

    function notesDisp() {
        if (currentSpecials.notes && currentSpecials.notes.length > 0) {
            return (
                <>
                <div className="grenze">Notes</div>
                {currentSpecials.notes.map((note, i) => {
                    return (
                        <InputGroup key={i} className="my-1">
                            <InputGroup.Text className="w-75"><div><strong>{note}</strong> Note</div></InputGroup.Text>
                            <InputGroup.Append>
                                <Button variant="outline-dark" onClick={() => spendNote(i)}>🎵</Button>
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
        newSongs.push(randomize ? randomSong() : input1.current.value);
        props.updateState('currentSpecials', { 'songs': newSongs, 'notes': currentSpecials.notes });
    }

    function addCustomNote(randomize) {
        let newNotes = currentSpecials.notes;
        newNotes.push(randomize ? randomNote() : input2.current.value);
        props.updateState('currentSpecials', { 'songs': currentSpecials.songs, 'notes': newNotes });
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
                        <div>Resource Item:<br/><strong>Songbooks</strong></div>
                        <div>Spend a songbook to add its song or note to your day's repertoire.</div>
                    </ClassDescription>
                </Col>
                <Col xs={12} md={7} className="mt-3">
                    <Row className="justify-content-center">
                        {skillHarmonyDisp()}
                    </Row>
                    {songsDisp()}
                    {notesDisp()}
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Song</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input1} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomSong(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomSong(true)}>🎲</Button>
                        </Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend><InputGroup.Text>Add Note</InputGroup.Text></InputGroup.Prepend>
                            <Form.Control ref={input2} />
                        </InputGroup>
                        <Form.Group className="d-flex justify-content-around">
                            <Button size="lg" variant="dark" onClick={() => addCustomNote(false)}>+</Button>
                            <Button size="lg" variant="dark" onClick={() => addCustomNote(true)}>🎲</Button>
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-center">
                            <Button variant="success" className="ability-randomize-button" onClick={createSongsAndNotes}>Rest<br/>Refresh Songs and Notes</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}