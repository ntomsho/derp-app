import React, { useState, useEffect } from 'react';
import { randomTag } from '../../dndb-tables';

//Advancements have following format:
//{typeAdv: type of advancement, advSelection: advancement choice}

export default function Advancement(props) {    
    //Stage 0: Select favorite tag
    //Stage 1: Select advancement type 
    //Stage 2: Select advancement
    const [stage, setStage] = useState(0);
    const [advSelected, setAdvSelected] = useState(null);
    const [tagSelection, setTagSelection] = useState(null);
    const [advTypeSelection, setAdvTypeSelection] = useState(null);
    const [randomTags, setRandomTags] = useState(null);
    
    const advTypes = ["Skill Training", "Upgrade Class Feature", "Bonus Resources"];

    useEffect(() => {
        if (props.experience === 10) {
            const randomTags = [];
            for (let i = 0; i < 3; i++) {
                randomTags.push(randomTag(props.cClass));
            }
            setRandomTags(randomTags);
        } else if (randomTags) {
            setRandomTags(null);
        }
    }, [props.experience])

    function changeExp(add) {
        if ((add && props.experience < 10) || (!add && props.experience > 0)) {
            props.updateState('experience', add ? props.experience + 1 : props.experience - 1);
        }
    }

    function expBar() {
        let bars = [];
        for (let i = 0; i < 10; i++) {
            bars.push(<div key={i} className="exp-bar-segment"></div>)
        }
        return (
            <div id="exp-bar" style={{backgroundPosition: `${100 - 10 * props.experience}% 0%`}}>
                {bars}
            </div>
        )
    }

    //Level Up needs to be on the char_select component
    //because it has a lot of consecutive state changes

    function favTagSelectDisp() {
        let tagChoices = randomTags;
        if (props.savedTag) randomTags.unshift(props.savedTag);
        return (
            <>
            <ul>
                {tagChoices.map((tag, i) => {
                    return (
                        <li key={i} className={`adv-choice${advSelected === i ? ' selected' : ''}`} onClick={() => setAdvSelected(i)}>
                            {tag}
                        </li>
                    )
                })}
            </ul>
            </>
        )
    }

    function advTypeSelectDisp() {

    }

    function advSelectDisp() {

    }

    function earnedAdvancements() {
        return (
            <ul>
                {props.advancements.map((adv, i) => {
                    return (
                        <li key={i}>
                            {adv.typeAdv} <strong>{adv.advSelection}</strong>
                        </li>
                    )
                })}
            </ul>
        )
    }

    function levelUpSection() {
        const header = <div><strong>Level Up!</strong></div>
        switch (stage) {
            case 1:
                return header + advTypeSelectDisp();
            case 2:
                return header + advSelectDisp();
            default:
                return header + favTagSelectDisp();
        }
    }




    function selectFavoriteTag(tag) {
        setTagSelection(tag)
        setAdvSelected(null);
    }

    function favoriteTagSelectionDisp() {
        let tags = [];
        if (props.savedTag) tags.push(props.savedTag);
        for (let i = 0; i < 3; i++) {
            tags.push(randomTag(props.cClass));
        }
        return (
            <>
            <ul>
                {tags.map((tag, i) => {
                    <li key={i} className={`adv-choice${advSelected === i ? ' selected' : ''}`} onClick={() => setAdvSelected(i)}>
                        {tag}
                    </li>
                })}
            </ul>
            <button disabled={!advSelected} onClick={() => selectFavoriteTag(tags[advSelected])}>>></button>
            </>
        )
    }

    function selectAdvancementType(adv) {
        setAdvTypeSelection(adv);
        setAdvSelected(null)
    }

    function advancementSelectionDisp() {
        // const possibleChoices = 
        const selectedChoices = props.advancements.map(adv => adv['category']);
        let choices = [];
        for (let i = 0; i < 3; i++) {
            if (selectedChoices.includes(possibleChoices[i])) {
                choices.push(possibleChoices[i]);
            }
        }
        if (!advTypeSelection) {
            return (
                <>
                <ul>
                    {choices.map((choice, i) => {
                        return (
                            <li key={i}>
                                {choice}
                            </li>
                        )
                    })}
                </ul>
                </>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
    
    return (
        <>
        <h2>Advancement</h2>
        <div id="advancement-container">
            <div id="experience-container">
                <h3>Experience</h3>
                <div id="exp-tracker">
                    <button className="exp-button" onClick={() => changeExp(false)}>-</button>
                    {expBar()}
                    <button className="exp-button" onClick={() => changeExp(true)}>+</button>
                </div>
                <div id="advancements">
                    <div>Whenever you mark 10 Experience, clear it and gain an Advancement.</div>
                </div>
            </div>
            <div id="advancement-container">
                <h3>Advancements</h3>
                {props.experience === 10 ? 
                    levelUpSection() : 
                    <></>
                }
                {earnedAdvancements()}
            </div>
        </div>
        </>
    )
}