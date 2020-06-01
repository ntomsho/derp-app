import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { random, CLASS_SKILLS, SKILL_USES, CLASS_COLORS, FIGHTING_SKILLS, CIVILIZED_SKILLS, CLASS_FIGHTING_SKILLS, CLASS_CASTING_SKILLS } from '../../dndb-tables';

export default function CharGenSkills(props) {
    const fightingSkills = CLASS_FIGHTING_SKILLS[props.cClass] || [];
    const maxSkills = (fightingSkills.length === 0 ? 1 : 0) + (props.raceTraits === "Human" ? 1 : 0);
    const [classSkillChosen, setClassSkillChosen] = useState(!!fightingSkills);
    const [skillFirstRoll, setSkillFirstRoll] = useState(true);

    const [chosenFightingSkill, setChosenFightingSkill] = useState((CLASS_FIGHTING_SKILLS[props.cClass] && CLASS_FIGHTING_SKILLS[props.cClass].length === 1) ? CLASS_FIGHTING_SKILLS[props.cClass][0] : null);
    const [chosenCastingSkill, setChosenCastingSkill] = useState(null);
    const [chosenHumanSkill, setChosenHumanSkill] = useState(null);

    useEffect(() => {
        if (fightingSkills.length === 1) props.updateSelection('selectedFightingSkill', fightingSkills[0]);
    }, [])

    useEffect(() => {
        if (fightingSkills.length > 0) return;
        for (let i = 0; i < props.trainedSkills.length; i++) {
            if (CLASS_SKILLS[props.cClass].includes(props.trainedSkills[i]) || props.trainedSkills[i] === props.selectedFightingSkill) {
                setClassSkillChosen(true);
                return;
            }
        }
        setClassSkillChosen(false);
    }, [JSON.stringify(props.trainedSkills)])

    const selectFightingSkill = (skill) => {
        if (fightingSkills.includes(skill)) {
            props.updateSelection('selectedFightingSkill', skill);
        }
    }
    
    function selectSkill(skill, reroll) {
        let newSkills = props.trainedSkills;

        if (newSkills.includes(skill)) return;
        if (CLASS_CASTING_SKILLS[props.cClass] && CLASS_CASTING_SKILLS[props.cClass][skill]) {
            newSkills[0] = skill;
        } else if (props.raceTraits === "Human") {
            newSkills[1] = skill;
        } else return;
        props.updateSelection('trainedSkills', newSkills, reroll);
    }

    function randomSkill() {
        let skill = random(CIVILIZED_SKILLS);
        while (props.trainedSkills.includes(skill)) {
            skill = random(CIVILIZED_SKILLS);
        }
        skillFirstRoll ? setSkillFirstRoll(false) : props.updateSelection('trainedSkills', props.trainedSkills, true);
        return skill;
    }

    function fightingSkillsDisplay() {
        let remainingSkills;
        if (fightingSkills.length > 0) {
            remainingSkills = fightingSkills.length === 2 ? <div>Choose {fightingSkills.join(" or ")}</div> : <div>Your class gives you training in {fightingSkills[0]}</div>;
        }

        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {FIGHTING_SKILLS.map((skill, i) => {
                    const classSkill = fightingSkills.length === 0 ? false : fightingSkills.includes(skill);
                    return (
                        <Button key={i}
                            style={classSkill ? { boxShadow: `0 0 0.5rem ${CLASS_COLORS[props.cClass]}` } : {}}
                            variant={props.selectedFightingSkill === skill ? "warning" : "outline-warning"}
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

    function civilizedSkillsDisplay() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {CIVILIZED_SKILLS.map((skill, i) => {
                    const classSkill = (CLASS_CASTING_SKILLS[props.cClass] && CLASS_CASTING_SKILLS[props.cClass][skill]);
                    return (
                        <Button key={i}
                            style={classSkill ? { boxShadow: `0 0 0.5rem ${CLASS_COLORS[props.cClass]}` } : {}}
                            variant={props.trainedSkills.includes(skill) ? "info" : "outline-info"}
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

    if (CLASS_FIGHTING_SKILLS[props.cClass] && !props.selectedFightingSkill) {
        return (
            <>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <h1 className="text-center">Select Fightin' Skill</h1>
                        <div className="text-center">This Skill will be your primary combat trait.</div>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {CLASS_FIGHTING_SKILLS[props.cClass].map((skill, i) => {
                                return (
                                    <Button key={i}
                                        variant={chosenFightingSkill === skill ? "warning" : "outline-warning"}
                                        className={`skill-button ${chosenFightingSkill === skill ? " selected" : ""}`}
                                        onClick={() => setChosenFightingSkill(skill)}
                                    >
                                        <h3>{skill}</h3>
                                        <small>{SKILL_USES[skill]}</small>
                                    </Button>
                                )
                            })}
                        <Button className="mt-5" size="lg" variant="primary" disabled={!chosenFightingSkill} onClick={() => selectFightingSkill(chosenFightingSkill)}>
                            Select {chosenFightingSkill}
                        </Button>
                        </div>
                    </Col>
                </Row>
            </>
        )
    }

    if (CLASS_CASTING_SKILLS[props.cClass] && props.trainedSkills.length < 1) {
        return (
            <>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <h1 className="text-center">Select Casting Skill</h1>
                        <div className="text-center">This Skill will be used for some rolls with your magic class feature.</div>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {Object.keys(CLASS_CASTING_SKILLS[props.cClass]).map((skill, i) => {
                                return (
                                    <Button key={i}
                                        variant={chosenCastingSkill === skill ? "info" : "outline-info"}
                                        className={`skill-button ${chosenCastingSkill === skill ? " selected" : ""}`}
                                        onClick={() => setChosenCastingSkill(skill)}
                                    >
                                        <h3>{skill}</h3>
                                        <small>{SKILL_USES[skill]}</small>
                                        <div style={{ color: CLASS_COLORS[props.cClass] }}>Use for: {CLASS_CASTING_SKILLS[props.cClass][skill]}</div>
                                    </Button>
                                )
                            })}
                        <Button className="mt-5" size="lg" variant="primary" disabled={!chosenCastingSkill} onClick={() => selectSkill(chosenCastingSkill, false)}>
                            Select {chosenCastingSkill}
                        </Button>
                        </div>
                    </Col>
                </Row>
            </>
        )
    }

    if (props.raceTraits === "Human" && ((!!props.selectedFightingSkill && props.trainedSkills.length < 1) || (!props.selectedFightingSkill && props.trainedSkills.length === 1))) {
        const skillDisp = chosenHumanSkill ? 
            <Button
                variant="info"
                className="skill-button"
                onClick={() => selectSkill(chosenHumanSkill, false)}
            >
                <h3>{chosenHumanSkill}</h3>
                <small>{SKILL_USES[chosenHumanSkill]}</small>
                {CLASS_CASTING_SKILLS[props.cClass] ?
                    <div style={{ color: CLASS_COLORS[props.cClass] }}>{CLASS_CASTING_SKILLS[props.cClass][chosenHumanSkill]}</div> :
                    null
                }
            </Button> :
            null
        return (
            <>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Button
                                variant={props.selectedFightingSkill ? "warning" : "info"}
                                className="skill-button"
                            >
                                <h3>{props.selectedFightingSkill ? props.selectedFightingSkill : props.trainedSkills[0]}</h3>
                                <small>{SKILL_USES[props.selectedFightingSkill ? props.selectedFightingSkill : props.trainedSkills[0]]}</small>
                                {CLASS_CASTING_SKILLS[props.cClass] ?
                                    <div style={{ color: CLASS_COLORS[props.cClass] }}>{CLASS_CASTING_SKILLS[props.cClass][props.trainedSkills[0]]}</div> :
                                    null
                                }
                            </Button>
                            <h3 className="text-center">Roll Random Skill</h3>
                            {skillDisp}
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={6} className="d-flex flex-column align-items-center">
                        {chosenHumanSkill ? 
                            <Button className="my-3" size="lg" variant="primary" onClick={() => selectSkill(chosenHumanSkill, false)}>Select</Button> : 
                            null
                        }
                        <Button className="my-3" size="lg" variant="dark" onClick={() => setChosenHumanSkill(randomSkill)}>{skillFirstRoll ? "Roll Skill" : "Reroll Skill"}</Button>
                    </Col>
                </Row>
            </>
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
        {/* <Row className="remaining-skills-row">
            <Col xs={6}>
                {fightingChoicesRemaining()}
            </Col>
            <Col xs={6}>
                {skillChoicesRemaining()}
            </Col>
        </Row> */}
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