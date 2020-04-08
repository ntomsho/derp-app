import React, {useState} from 'react';
import { random, CLASSES, CLASS_COLORS, CLASS_DESCRIPTIONS } from '../../dndb-tables'

export default function CharGenClass(props) {
    const [firstRoll, setFirstRoll] = useState(!props.cClass);
    const [bannerAnim, setBannerAnim] = useState(false);
    const [fadeAnim, setFadeAnim] = useState(false);

    let classHeadline;
    if (props.cClass) {
        classHeadline = (
            <div className={bannerAnim ? "class-headline extend" : "class-headline"}
                style={{ backgroundColor: CLASS_COLORS[props.cClass] }}
                onAnimationEnd={() => setBannerAnim(false)}
            >
                <h2 className={bannerAnim ? "class-headline-text fade" : "class-headline-text"}>{props.cClass}</h2>
            </div>
        )
    }

    function rollClass() {
        if (firstRoll || props.rerolls > 0) {
            setBannerAnim(true);
            props.updateSelection('cClass', random(CLASSES), !firstRoll)
            if (firstRoll) setFirstRoll(false);
        }
    }

    return (
        <>
        <button onClick={rollClass}>
            {firstRoll ? "Roll Class" : "Reroll Class"}
        </button>
        <div className="class-selections">
            {CLASSES.map((c, i) => {
                return (
                    <button key={i}
                        className={`class-button${props.cClass === c ? " selected" : ""}`}
                        onClick={() => {
                            setBannerAnim(true);
                            props.updateSelection('cClass', c);
                        }}
                        style={{ backgroundColor: CLASS_COLORS[c] }}>
                        {c}
                    </button>
                )
            })}
        </div>
        <div className="selected-class-info">
            {classHeadline}
            <div>{CLASS_DESCRIPTIONS[props.cClass]}</div>
        </div>
        </>
    )
}