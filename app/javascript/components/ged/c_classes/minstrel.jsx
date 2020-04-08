import React, { useState } from 'react';
import { random, SONGS, ELEMENTS, GERUNDS } from '../../../dndb-tables';
import RaceTraits from '../race_traits';

export default function Minstrel(props) {
    const { currentSpecials } = props;
    const [skillBorrowed, setSkillBorrowed] = useState(false);
    const input1 = React.createRef();
    const input2 = React.createRef();

    if (!currentSpecials.songs) {
        props.updateState('currentSpecials', { 'songs': [], 'notes': [] })
    }

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
        for (let i = 0; i < 5; i++) {
            notes.push(randomNote());
        };
        props.updateState('currentSpecials', { 'songs': songs.sort(), 'notes': notes });
    }

    function removeSong(songInd) {
        let newSongs = currentSpecials.songs;
        newSongs.splice(songInd, 1);
        props.updateState('currentSpecials', { 'songs': newSongs, 'notes': currentSpecials.notes });
    }

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
            <div>Skill Harmony {skillBorrowed ? "Expended" : "Available"}</div>
            <button onClick={() => setSkillBorrowed(skillBorrowed ? false : true)}>
                {skillBorrowed ? "End Scene" : "Borrow Skill"}
            </button>
            </>
        )
    }

    function songsDisp() {
        if (currentSpecials.songs && currentSpecials.songs.length > 0) {
            return (
                <>
                <h3>Songs</h3>
                <ul className="resource-list">
                    {currentSpecials.songs.map((song, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div>
                                    <strong>{song}</strong>
                                    <ul className="resource-subfield">
                                        {songEffects(song)}
                                    </ul>
                                </div>
                                <button onClick={() => removeSong(i)}>X</button>
                            </li>
                        )
                    })}
                </ul>
                </>
            )
        }
    }

    function notesDisp() {
        if (currentSpecials.notes && currentSpecials.notes.length > 0) {
            return (
                <>
                <h3>Notes</h3>
                <ul className="resource-list">
                    {currentSpecials.notes.map((note, i) => {
                        return (
                            <li key={i} className="resource-list-entry">
                                <div><strong>{note}</strong> Note</div>
                                <button onClick={() => spendNote(i)}>🎵</button>
                            </li>
                        )
                    })}
                </ul>
                </>
            )
        }
    }

    function addCustomSong(randomize) {
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
        <div className="class-ability-container">
            <div className="class-info">
                <div className="class-desc">A rockin’ magical songsmith and all-around entertainer.</div>
                <br />
                <div className="ability-desc">
                    <div className="ability-desc-scrollbox">
                        <div>Magic Ability:<br /><strong>Bard Songs</strong></div>
                        <div>Your music is magic! Whenever you rest, you recall a selection of three song genres and five magic notes.</div>
                        <div>Spend one of your notes to play a song, performing the song's effect modified by the effect of the note used.</div>
                        <div>You can also use your Skill Harmony once per scene to borrow a nearby ally's Skill Training, gaining Skill Advantage on an action using that Skill.</div>
                        <br/>
                        <div>Resource Item:<br/><strong>Songbooks</strong></div>
                        <div>Spend a songbook to add its song or note to your day's repertoire.</div>
                        <br />
                    </div>
                </div>
                <RaceTraits raceString={props.raceString} raceTraits={props.raceTraits} updateState={props.updateState} />
            </div>
            <div className="class-ability-display">
                <div className="ability-main">
                    {skillHarmonyDisp()}
                </div>
                <div className="resource-lists-container" id="form-list">
                    <div id="songs-list">
                        {songsDisp()}
                    </div>
                    <div id="notes-disp">
                        {notesDisp()}
                    </div>
                </div>
                <div className="ability-management-container">
                    <div className="custom-add-row">
                        <div>Add Song: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input1}></input>
                            <button onClick={() => addCustomSong(false)}>+</button>
                            <button onClick={() => addCustomSong(true)}>🎲</button>
                        </div>
                    </div>
                    <div className="custom-add-row">
                        <div>Add Note: </div>
                        <div className="custom-add-field">
                            <input type="text" ref={input2}></input>
                            <button onClick={() => addCustomNote(false)}>+</button>
                            <button onClick={() => addCustomNote(true)}>🎲</button>
                        </div>
                    </div>
                    <button className="ability-randomize-button" onClick={createSongsAndNotes}>Generate New Songs<br/>(On rest)</button>
                </div>
            </div>
        </div>
    )
}