import React from 'react';
import { FIGHTING_SKILLS } from '../../dndb-tables';
import Button from 'react-bootstrap/Button';

const SkillButton = (props) => {
    return (
        <Button className={`h-100 skill-button ${props.classSkill ? " class-skill" : ""} ${props.selected ? " selected" : ""}`}
        variant={FIGHTING_SKILLS.includes(props.children) ? "warning" : "info"}
        block
        onClick={() => props.setHighlightedSkill(props.children)}
            style={props.classSkill ? { borderColor: props.classColor }: {}}
        >
            <h3>{props.children}</h3>
        </Button>
    )
}

export default SkillButton;
