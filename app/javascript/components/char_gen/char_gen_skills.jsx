import React, {useState, useEffect} from 'react';
import { random, CLASS_SKILLS, SKILL_USES, CLASS_COLORS, FIGHTING_SKILLS, CIVILIZED_SKILLS, CLASS_FIGHTING_SKILLS } from '../../dndb-tables';

export default function CharGenSkills(props) {
    const fightingSkills = CLASS_FIGHTING_SKILLS[props.cClass];
    const maxSkills = (fightingSkills ? 0 : 1) + (props.raceTraits === "Human" ? 1 : 0);
    const [classSkillChosen, setClassSkillChosen] = useState(!!fightingSkills);
    const [skillFirstRoll, setSkillFirstRoll] = useState(true);
    const [lastSelected, setLastSelected] = useState(null);

    useEffect(() => {
        if (fightingSkills && fightingSkills.length === 1) props.updateSelection('selectedFightingSkill', fightingSkills[0]);
    }, [])

    useEffect(() => {
        if (fightingSkills) return;
        for (let i = 0; i < props.trainedSkills.length; i++) {
            if (CLASS_SKILLS[props.cClass].includes(props.trainedSkills[i]) || props.trainedSkills[i] === props.selectedFightingSkill) {
                setClassSkillChosen(true);
                return;
            }
        }
        setClassSkillChosen(false);
    }, [JSON.stringify(props.trainedSkills)])

    function selectFightingSkill(skill) {
        if (fightingSkills.includes(skill)) {
            setLastSelected(skill);
            props.updateSelection('selectedFightingSkill', skill);
        }
    }
    
    function selectSkill(skill, reroll) {
        setLastSelected(skill);
        if (!classSkillChosen && !CLASS_SKILLS[props.cClass].includes(skill)) return;
        let newSkills = props.trainedSkills;
        if (newSkills.includes(skill)) {
            newSkills.splice(newSkills.indexOf(skill), 1);
        } else {
            newSkills.push(skill);
        }
        props.updateSelection('trainedSkills', newSkills, reroll);
    }

    function selectRandomSkill() {
        let skill = random(CIVILIZED_SKILLS);
        while (props.trainedSkills.includes(skill)) {
            skill = random(CIVILIZED_SKILLS);
        }
        let reroll = false;
        skillFirstRoll ? setSkillFirstRoll(false) : reroll = true;
        selectSkill(skill, reroll);
    }

    function descDisplay() {
        if (lastSelected) {
            return (
                <div style={{ width: '25%' }}>
                    <h3 className="skill-desc-headline">{lastSelected}</h3>
                    <div className="skill-desc-content">{SKILL_USES[lastSelected]}</div>
                </div>
            )
        }
    }

    function fightingSkillsDisplay() {
        let remainingSkills;
        if (fightingSkills) {
            remainingSkills = fightingSkills.length === 2 ? <div>Choose one</div> : <div>Your class gives you training in {fightingSkills[0]}</div>;
        }

        return (
            <div className="class-column">
                <h3>Fightin' Skills</h3>
                {remainingSkills}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {FIGHTING_SKILLS.map((skill, i) => {
                        const classSkill = fightingSkills === undefined ? false : fightingSkills.includes(skill);
                        return (
                            <button key={i}
                                style={classSkill ? { borderColor: CLASS_COLORS[props.cClass] } : {}}
                                className={`skill-button ${classSkill ? " class-skill" : ""} ${props.selectedFightingSkill === skill ? " selected" : ""}`}
                                onClick={() => selectFightingSkill(skill)}
                            >
                                {skill}
                            </button>
                        )
                    })}
                </div>
                {descDisplay()}
            </div>
        )
    }

    function skillChoicesRemaining() {
        if (props.trainedSkills.length >= maxSkills) {
            return (
                <div>That's enough for you</div>
            )
        }
        if (!fightingSkills && !classSkillChosen) {
            return (
                <div>Select one of your Class Skills</div>
            )
        }
        if (props.raceTraits === "Human" && classSkillChosen) {
            return (
                <>
                    <div>Select your second Class Skill or roll a random Civilized Skill</div>
                    <button onClick={selectRandomSkill}>{skillFirstRoll ? "Roll Skill" : "Reroll Skill"}</button>
                </>
            )
        }
    }

    function civilizedSkillsDisplay() {
        return (
            <div className="class-column">
                <h3>Civilized Skills</h3>
                {skillChoicesRemaining()}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {CIVILIZED_SKILLS.map((skill, i) => {
                        const classSkill = CLASS_SKILLS[props.cClass].includes(skill);
                        return (
                            <button key={i}
                                style={classSkill ? { borderColor: CLASS_COLORS[props.cClass] } : {}}
                                className={`skill-button ${classSkill ? " class-skill" : ""} ${props.trainedSkills.includes(skill) ? " selected" : ""}`}
                                onClick={() => selectSkill(skill, false)}
                            >
                                {skill}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            {fightingSkillsDisplay()}
            {civilizedSkillsDisplay()}
        </div>
    )
}