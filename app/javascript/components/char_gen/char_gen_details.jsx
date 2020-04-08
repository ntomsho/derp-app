import React, {useState} from 'react';
import { random, BACKGROUNDS, APPEARANCES, DERPS } from '../../dndb-tables';

export default function CharGenDetails(props) {

    function handleChange(event) {
        props.updateSelection(event.target.name, event.target.value, false);
    }

    function randomizeField(field, table) {
        if (props.rerolls > 0) {
            props.updateSelection(field, random(table), true);
        }
    }
    
    return (
        <>
            <div>
                <span>Background</span>
                <input onChange={handleChange} type="text" name="background" value={props.background} placeholder="Background"></input>
                <button onClick={() => randomizeField('background', BACKGROUNDS)}>Reroll</button>
                <div>What you did before adventuring</div>
            </div>
            <br/>
            <div>
                <span>Appearance</span>
                <input onChange={handleChange} type="text" name="appearance" value={props.appearance} placeholder="Appearance"></input>
                <button onClick={() => randomizeField('appearance', APPEARANCES)}>Reroll</button>
                <div>What you look like</div>
            </div>
            <br/>
            <div>
                <span>Derp</span>
                <input onChange={handleChange} type="text" name="derp" value={props.derp} placeholder="Derp"></input>
                <button onClick={() => randomizeField('derp', DERPS)}>Reroll</button>
                <div>Why you should never have been trusted to do this job</div>
            </div>
        </>
    )
}