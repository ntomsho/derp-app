import React from 'react';

export default function SkillButton(props) {
    const { skill } = props;
    return (
        <button className={`skill-button ${props.classSkill ? " class-skill" : ""} ${props.selected ? " selected" : ""}`}
            onClick={() => props.setHighlightedSkill(skill)}
            style={props.classSkill ? { borderColor: props.classColor }: {}}
        >
            {props.skill}
        </button>
    )
}