import React, { useState, useEffect } from 'react';
import { CLASS_SKILLS, CLASS_COLORS, FIGHTING_SKILLS, CIVILIZED_SKILLS, SKILL_USES, CLASS_CASTING_SKILLS, CLASS_FIGHTING_SKILLS } from '../../dndb-tables';
import SkillButton from './skill_button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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

    function skillDesc() {
        const trained = (props.selectedFightingSkill === highlightedSkill || props.trainedSkills.includes(highlightedSkill));
        if (highlightedSkill) {
            const uses = SKILL_USES[highlightedSkill].split(", ");
            let casting = null;
            if (CLASS_CASTING_SKILLS[props.cClass]) {
                casting = (
                    <Row style={{color: CLASS_COLORS[props.cClass]}} className="grenze text-center justify-content-center">
                        {CLASS_CASTING_SKILLS[props.cClass][highlightedSkill]}
                    </Row>
                )
            }
            return (
                <>
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h2 className="skill-desc-headline text-center">{highlightedSkill}</h2>
                    </Col>
                    {trained ?
                    <Col xs={12}>
                        <h3 className="grenze text-center">Trained</h3>
                    </Col>
                    :
                    null}
                </Row>
                <Row className="justify-content-center">
                    <div className="d-flex vert-to-hor">
                        {uses.map((string, i) => {
                            return (
                                <div className="grenze" key={i}>{string}{i === uses.length - 1 ? "" : ", "} </div>
                            )
                        })}
                    </div>
                </Row>
                {casting}
                <Row className="justify-content-center mt-3">
                    <Button variant="outline-secondary" onClick={() => setHighlightedSkill("")}>Close</Button>
                </Row>
                </>
            )
        }
    }

    function createSkillRow(i) {
        const skills = i === 0 ? FIGHTING_SKILLS : CIVILIZED_SKILLS.slice(i - 3, i);
        return skills.map((skill, ind) => {
            let castingSkill
            if (CLASS_CASTING_SKILLS[props.cClass]) castingSkill = CLASS_CASTING_SKILLS[props.cClass].includes(skill)
            return (
                <Col className="px-1 my-1" style={{minHeight: '88px'}} key={ind} xs={4}>
                    <SkillButton
                        classSkill={castingSkill}
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