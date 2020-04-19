import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { random, CLASS_SKILLS, SKILL_USES, CLASS_COLORS, FIGHTING_SKILLS, CIVILIZED_SKILLS, CLASS_FIGHTING_SKILLS } from '../../dndb-tables';

export default function CharGenSkills(props) {
    const fightingSkills = CLASS_FIGHTING_SKILLS[props.cClass];
    const maxSkills = (fightingSkills ? 0 : 1) + (props.raceTraits === "Human" ? 1 : 0);
    const [classSkillChosen, setClassSkillChosen] = useState(!!fightingSkills);
    const [skillFirstRoll, setSkillFirstRoll] = useState(true);

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

    const selectFightingSkill = (skill) => {
        debugger
        if (fightingSkills.includes(skill)) {
            props.updateSelection('selectedFightingSkill', skill);
        }
    }
    
    function selectSkill(skill, reroll) {
        debugger
        let newSkills = props.trainedSkills;
        if (newSkills.includes(skill)) {
            newSkills.splice(newSkills.indexOf(skill), 1);
        } else {
            if (props.trainedSkills.length >= maxSkills || (!classSkillChosen && !CLASS_SKILLS[props.cClass].includes(skill))) return;
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

    function fightingSkillsDisplay() {
        let remainingSkills;
        if (fightingSkills) {
            remainingSkills = fightingSkills.length === 2 ? <div>Choose {fightingSkills.join(" or ")}</div> : <div>Your class gives you training in {fightingSkills[0]}</div>;
        }

        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {FIGHTING_SKILLS.map((skill, i) => {
                    const classSkill = fightingSkills === undefined ? false : fightingSkills.includes(skill);
                    return (
                        <Button key={i}
                            style={classSkill ? { color: CLASS_COLORS[props.cClass] } : {}}
                            // active={props.selectedFightingSkill === skill}
                            variant="warning"
                            className={`skill-button ${classSkill ? " class-skill" : ""} ${props.selectedFightingSkill === skill ? " selected" : ""}`}
                            onClick={() => selectFightingSkill(skill)}
                        >
                            <h3>{skill}</h3>
                            <small>{SKILL_USES[skill]}</small>
                        </Button>
                    )
                })}
            </div>
        )
    }

    function fightingChoicesRemaining() {
        if (fightingSkills) {
            return fightingSkills.length === 2 ? <div>Choose {fightingSkills.join(" or ")}</div> : <div>Your class gives you training in {fightingSkills[0]}</div>;
        } else {
            return <div>Your class doesn't get training in any Fightin' Skills.</div>
        }
    }

    function skillChoicesRemaining() {
        if (props.trainedSkills.length >= maxSkills) {
            return (
                <div>That's enough for you</div>
            )
        }
        if (!fightingSkills && !classSkillChosen) {
            return (
                <div>Select one of your <span style={{ color: CLASS_COLORS[props.cClass] }}>Class Skills</span></div>
            )
        }
        if (props.raceTraits === "Human" && classSkillChosen) {
            return (
                <>
                    <Row>
                        <div>Select your second <span style={{ color: CLASS_COLORS[props.cClass] }}>Class Skill</span> or roll a random Civilized Skill</div>
                    </Row>
                    <Row className="mb-3 justify-content-center">
                        <Button size="lg" variant="dark" onClick={selectRandomSkill}>{skillFirstRoll ? "Roll Skill" : "Reroll Skill"}</Button>
                    </Row>
                </>
            )
        }
    }

    function civilizedSkillsDisplay() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {CIVILIZED_SKILLS.map((skill, i) => {
                    const classSkill = CLASS_SKILLS[props.cClass].includes(skill);
                    return (
                        <Button key={i}
                            style={classSkill ? { color: CLASS_COLORS[props.cClass] } : {}}
                            // active={props.trainedSkills.includes(skill)}
                            variant="info"
                            className={`skill-button ${classSkill ? " class-skill" : ""} ${props.trainedSkills.includes(skill) ? " selected" : ""}`}
                            onClick={() => selectSkill(skill, false)}
                        >
                            <h3>{skill}</h3>
                            <small>{SKILL_USES[skill]}</small>
                        </Button>
                    )
                })}
            </div>
        )
    }

    return (
        <>
        <Row>
            <Col xs={6}>
                <h2 className="text-center">Fightin' Skills</h2>
            </Col>
            <Col xs={6}>
                <h2 className="text-center">Civilized Skills</h2>
            </Col>
        </Row>
        <Row className="remaining-skills-row">
            <Col xs={6}>
                {fightingChoicesRemaining()}
            </Col>
            <Col xs={6}>
                {skillChoicesRemaining()}
            </Col>
        </Row>
        <Row>
            <Col xs={6}>
            {fightingSkillsDisplay()}
            </Col>
            <Col xs={6}>
            {civilizedSkillsDisplay()}
            </Col>
        </Row>
        </>
    )
}