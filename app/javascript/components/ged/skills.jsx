import React, { useState, useEffect } from 'react';
import { CLASS_SKILLS, CLASS_COLORS, SKILLS, FIGHTING_SKILLS, CIVILIZED_SKILLS, SKILL_USES, random, RACE_TRAITS } from '../../dndb-tables';
import SkillButton from './skill_button';

export default function Skills(props) {
    const [highlightedSkill, setHighlightedSkill] = useState("");
    const [numClassSkills, setNumClassSkills] = useState(0);
    const [numRegSkills, setNumRegSkills] = useState(0);
    const classSkills = CLASS_SKILLS[props.cClass] || [];
    const maxRegSkills = props.race === "Human" ? 1 : 0;

    useEffect(() => {
        const skillSet = props.trainedSkills;
        let classSkillCount = 0;
        let regSkillCount = 0;
        skillSet.forEach(skill => {
            if (classSkills.includes(skill)) {
                classSkillCount === 0 ? classSkillCount++ : regSkillCount++;
            } else {
                regSkillCount++;
            }
        })
        setNumClassSkills(classSkillCount);
        setNumRegSkills(regSkillCount);
    }, [JSON.stringify(props.trainedSkills)])
    
    function remainingClassSkills() {
        if (numClassSkills === 0) {
            return (
                <span>Choose a <strong style={{ border: `3px solid ${CLASS_COLORS[props.cClass]}` }}>Class Skill</strong></span>
            )
        }
    }

    function randomSkill() {
        let newSkill = random(SKILLS);
        while (props.trainedSkills.includes(newSkill)) {
            newSkill = random(SKILLS);
        }
        return newSkill;
    }
    
    function remainingSkills() {
        if (numRegSkills < maxRegSkills) {
            return (
                <>
                <span>{maxRegSkills} Random Skill{numRegSkills > 1 ? "s" : ""} Remaining</span>
                <button className="randomize-button" onClick={() => selectSkill(randomSkill())}>🎲</button>
                </>
            )
        }
    }

    function skillDesc() {
        if (highlightedSkill) {
            return (
                <div style={{ width: '25%' }}>
                    <h3 className="skill-desc-headline">{highlightedSkill}</h3>
                    <div className="skill-desc-content">{SKILL_USES[highlightedSkill]}</div>
                    <button className="select-skill-button" onClick={() => selectSkill(highlightedSkill)}>{props.trainedSkills.includes(highlightedSkill) ? 'Remove Skill' : 'Add Skill'}</button>
                </div>
            )
        }
    }

    function selectSkill(skill) {
        let newSkillSet = props.trainedSkills;
        const inClass = classSkills.includes(skill);
        const selected = props.trainedSkills.includes(skill);

        if (selected) {
            newSkillSet.splice(newSkillSet.indexOf(skill), 1);
            props.updateState('trainedSkills', newSkillSet);
        } else {
            if (inClass && (numClassSkills > 0 && numRegSkills >= maxRegSkills)) {
                return
            } else if (!inClass && numRegSkills >= maxRegSkills) {
                return
            }
            newSkillSet.push(skill);
            props.updateState('trainedSkills', newSkillSet);
        }
    }

    function createSkillRow(i) {
        const skills = i === 0 ? FIGHTING_SKILLS : CIVILIZED_SKILLS.slice(i - 3, i);        
        return skills.map((skill, ind) => {
            return (
                <SkillButton key={ind}
                    skill={skill}
                    classSkill={classSkills.includes(skill)}
                    selected={props.selectedFightingSkill === skill || props.trainedSkills.includes(skill)}
                    setHighlightedSkill={setHighlightedSkill}
                    // selectSkill={selectSkill}
                    classColor={CLASS_COLORS[props.cClass]}
                />
            )
        })
    }

    // function updateTraits(event) {
    //     let newTraits = props.raceTraits;
    //     newTraits[parseInt(event.target.name)] = event.target.value;
    //     props.updateState('raceTraits', newTraits);
    // }

    // function raceTraits() {
    //     if (props.raceString !== "Human") {
    //         return (
    //             <div>
    //                 <h3>Race Traits</h3>
    //                 <div>
    //                     <input type="text" name="0" onChange={updateTraits} value={props.raceTraits[0] || ""}></input>
    //                     <button className="randomize-button" onClick={() => props.updateState('raceTraits', [random(RACE_TRAITS), props.raceTraits[1] || ""])}>🎲</button>
    //                     <input type="text" name="1" onChange={updateTraits} value={props.raceTraits[1] || ""}></input>
    //                     <button className="randomize-button" onClick={() => props.updateState('raceTraits', [props.raceTraits[0] || "", random(RACE_TRAITS)])}>🎲</button>
    //                 </div>
    //             </div>
    //         )
    //     }
    // }

    return (
        <>
        <h2 style={{marginBottom: 0}}>Skills</h2>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <div id="skills-container">
                <div className="remaining-skills">
                {remainingSkills()}
                {remainingClassSkills()}
                </div>
                <h3>Fightin' Skills</h3>
                <div className="sheet-row">
                    {createSkillRow(0)}
                </div>
                <h3>Civilized Skills</h3>
                <div className="sheet-row">
                    {createSkillRow(3)}
                </div>
                <div className="sheet-row">
                    {createSkillRow(6)}
                </div>
            </div>
            {skillDesc()}
        </div>
        {/* {raceTraits()} */}
        </>
    )
}