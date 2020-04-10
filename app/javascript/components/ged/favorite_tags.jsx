import React from 'react';

export default function FavoriteTags(props) {
    function handleChange(event) {
        props.updateState('savedTag', event.target.value)
    }

    return (
        <>
        <h3>Favorite Tags</h3>
        <div>Whenever you rest, you can swap each of these one time in place of one of the {props.resourceName} you rolled.</div>
        <ul>
            {props.favoriteTags.map((tag, i) => <li key={i}>{tag}</li>)}
        </ul>
        <div><strong>Saved Tag</strong></div>
        <input type="text" onChange={handleChange} value={props.savedTag || ""}></input>
        <div>You can put any tag that you roll or acquire here and can change it whenever you want. When you gain a favorite tag from advancement, you may choose this tag instead of the three that are rolled.</div>
        </>
    )
}