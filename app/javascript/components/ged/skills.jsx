import React, { useState, useEffect } from 'react';
import { CLASS_SKILLS, CLASS_COLORS, SKILLS, FIGHTING_SKILLS, CIVILIZED_SKILLS, SKILL_USES, random, RACE_TRAITS } from '../../dndb-tables';
import SkillButton from './skill_button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

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
    
    // function remainingClassSkills() {
    //     if (numClassSkills === 0) {
    //         return (
    //             <span>Choose a <strong style={{ border: `3px solid ${CLASS_COLORS[props.cClass]}` }}>Class Skill</strong></span>
    //         )
    //     }
    // }

    // function randomSkill() {
    //     let newSkill = random(SKILLS);
    //     while (props.trainedSkills.includes(newSkill)) {
    //         newSkill = random(SKILLS);
    //     }
    //     return newSkill;
    // }
    
    // function remainingSkills() {
    //     if (numRegSkills < maxRegSkills) {
    //         return (
    //             <>
    //             <span>{maxRegSkills} Random Skill{numRegSkills > 1 ? "s" : ""} Remaining</span>
    //             <button className="randomize-button" onClick={() => selectSkill(randomSkill())}>🎲</button>
    //             </>
    //         )
    //     }
    // }

    function skillDesc() {
        if (highlightedSkill) {
            const uses = SKILL_USES[highlightedSkill].split(", ");
            return (
                <>
                <Row className="justify-content-center">
                    <h2 className="skill-desc-headline text-center">{highlightedSkill}</h2>
                </Row>
                <Row className="justify-content-center">
                    <div className="d-flex vert-to-hor">
                        {uses.map((string, i) => {
                            return (
                                <div className="grenze" key={i}>{string}{i === uses.length - 1 ? "" : ", "} </div>
                            )
                        })}
                    </div>
                {/* <button className="select-skill-button" onClick={() => selectSkill(highlightedSkill)}>{props.trainedSkills.includes(highlightedSkill) ? 'Remove Skill' : 'Add Skill'}</button> */}
                </Row>
                </>
            )
        }
    }

    // function selectSkill(skill) {
    //     let newSkillSet = props.trainedSkills;
    //     const inClass = classSkills.includes(skill);
    //     const selected = props.trainedSkills.includes(skill);

    //     if (selected) {
    //         newSkillSet.splice(newSkillSet.indexOf(skill), 1);
    //         props.updateState('trainedSkills', newSkillSet);
    //     } else {
    //         if (inClass && (numClassSkills > 0 && numRegSkills >= maxRegSkills)) {
    //             return
    //         } else if (!inClass && numRegSkills >= maxRegSkills) {
    //             return
    //         }
    //         newSkillSet.push(skill);
    //         props.updateState('trainedSkills', newSkillSet);
    //     }
    // }

    function createSkillRow(i) {
        const skills = i === 0 ? FIGHTING_SKILLS : CIVILIZED_SKILLS.slice(i - 3, i);        
        return skills.map((skill, ind) => {
            return (
                <Col className="px-1 my-1" style={{minHeight: '88px'}} key={ind} xs={4}>
                    <SkillButton
                        classSkill={classSkills.includes(skill)}
                        selected={props.selectedFightingSkill === skill || props.trainedSkills.includes(skill)}
                        setHighlightedSkill={setHighlightedSkill}
                        classColor={CLASS_COLORS[props.cClass]}
                    >
                        {skill}
                    </SkillButton>
                </Col>
            )
        })
    }

    return (
        <Container className="mb-4">
            <Row>
                <h1>Skills</h1>
            </Row>
            <Row>
                {/* <div className="remaining-skills">
                {remainingSkills()}
                {remainingClassSkills()}
                </div> */}
                <Col xs={12} md={9}>
                    <h2>Fightin' Skills</h2>
                    <Row>
                        {createSkillRow(0)}
                    </Row>
                    <h2>Civilized Skills</h2>
                    <Row>
                        {createSkillRow(3)}
                    </Row>
                    <Row>
                        {createSkillRow(6)}
                    </Row>
                </Col>
                <Col xs={12} md={3} className="mt-md-auto mb-md-auto">
                    {skillDesc()}
                </Col>
            </Row>
        </Container>
    )
}