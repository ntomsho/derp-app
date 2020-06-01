import React from 'react';
import { FIGHTING_SKILLS } from '../../dndb-tables';
import Button from 'react-bootstrap/Button';

const SkillButton = (props) => {
    function buttonVariant() {
        if (FIGHTING_SKILLS.includes(props.children)) {
            return props.selected ? "warning" : "outline-warning";
        } else {
            return props.selected ? "info" : "outline-info";
        }
    }
    
    return (
        <Button className={`h-100 skill-button ${props.classSkill ? " class-skill" : ""}`}
        variant={buttonVariant()}
        block
        onClick={() => props.setHighlightedSkill(props.children)}
            style={props.classSkill ? { boxShadow: `0 0 0.5rem ${props.classColor}` }: {}}
        >
            <h3>{props.children}</h3>
        </Button>
    )
}

export default SkillButton;
