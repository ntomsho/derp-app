import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { random, CLASSES, CLASS_COLORS, CLASS_DESCRIPTIONS } from '../../dndb-tables';

export default function CharGenClass(props) {
    const [firstRoll, setFirstRoll] = useState(!props.cClass);
    const [bannerAnim, setBannerAnim] = useState(false);
    const [fadeAnim, setFadeAnim] = useState(false);

    let classHeadline;
    if (props.cClass) {
        classHeadline = (
            <div /*className={bannerAnim ? "class-headline extend" : "class-headline"}*/
                className="w-100 text-white"
                style={{ backgroundColor: CLASS_COLORS[props.cClass] }}
                onAnimationEnd={() => setBannerAnim(false)}
            >
                <h2 className={"ml-4"}>{props.cClass}</h2>
            </div>
        )
    }

    function rollClass() {
        if (firstRoll || props.rerolls > 0) {
            setBannerAnim(true);
            let rolledClass = random(CLASSES);
            while (rolledClass === props.cClass) {
                rolledClass = random(CLASSES)
            }
            props.updateSelection('cClass', rolledClass, !firstRoll)
            if (firstRoll) setFirstRoll(false);
        }
    }

    return (
        <>
        <Row className="mt-4">
            {classHeadline}
        </Row>
        <Row className="mb-4">
            <em>{CLASS_DESCRIPTIONS[props.cClass]}</em>
        </Row>
        <Row className="justify-content-center mb-4">
            <Button block size="lg" onClick={rollClass} variant="dark">
                {firstRoll ? "Roll Class" : "Reroll Class"}
            </Button>
        </Row>
        <Row>
            {CLASSES.map((c, i) => {
                return (
                    <Col xs={6} sm={5} md={4} lg={3} key={i}>
                        <Button size="lg" block
                            className={`class-button${props.cClass === c ? " selected" : ""}`}
                            onClick={() => {
                                setBannerAnim(true);
                                props.updateSelection('cClass', c);
                            }}
                            style={{ color: "white", backgroundColor: CLASS_COLORS[c] }}>
                            <h3>{c}</h3>
                        </Button>
                    </Col>
                )
            })}
        </Row>
        </>
    )
}