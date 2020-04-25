import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function RulesModal(props) {
    return (
        <Modal show={props.show} onHide={props.onHide}>
        <div className={`rules-modal-container ${props.extended ? '' : ' hidden'}`}>
            <div className="rules-modal-main">
                <Modal.Header closeButton>
                    <h1 className="rules-modal-header text-center" style={{color: 'orangered'}}>GED<br/>Guild of Expendable Dungeoneers</h1>
                </Modal.Header>
                <Modal.Body id="rules-modal-body">
                <Row>
                    <h2 className="rules-modal-header" style={{textDecoration: 'underline'}}>THE RULES</h2>
                </Row>
                <Row>
                    <h2 className="rules-modal-header">TAKING AN ACTION</h2>
                </Row>
                <Row>
                    <h2 className="rules-modal-header">Roll 1d20 + Advantage Dice (d6s)</h2>
                </Row>
                
                <Row>
                    <Col xs={2} className="text-right">
                        <strong className="rules-modal-left-tab">9-</strong>
                    </Col>
                    <Col xs={6} className="text-left">
                        <span>Failure: You fail; take a Consequence</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} className="text-right">
                        <strong className="rules-modal-left-tab">10-17</strong>
                    </Col>
                    <Col xs={6} className="text-left">
                        <span>Pass: You succeed or make Progress (2), but take a Consequence</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} className="text-right">
                        <strong className="rules-modal-left-tab">18+</strong>
                    </Col>
                    <Col xs={6} className="text-left">
                        <span>Success: You succeed or make Progress (2)</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} className="text-right">
                        <strong className="rules-modal-left-tab">Nat 1</strong>
                    </Col>
                    <Col xs={6} className="text-left">
                        <span>Critical Failure: You fail, hard; take a Serious Consequence</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} className="text-right">
                        <strong className="rules-modal-left-tab">Nat 20</strong>
                    </Col>
                    <Col xs={6} className="text-left">
                        <span>Critical Success: You succeed or make Progress (2) and then some</span>
                    </Col>
                </Row>

                <Row>
                    <h2 className="rules-modal-header">ADVANTAGE & DIFFICULTY</h2>
                </Row>
                <Row>
                    <h3 className="rules-modal-header">3 sources of Advantage</h3>
                </Row>
                <Row>
                    <div className="grenze">Each gives 1 Advantage Die</div>
                </Row>
                <Row>
                    <h3 className="rules-modal-header">GM gives 0-3 Difficulty</h3>
                </Row>
                <Row>
                    <div className="grenze">Each removes 1 Advantage Die</div>
                </Row>
                <Row>
                    <strong className="grenze">(If there is more Difficulty than you have Advantage, Roll 1d20 - 1d6)</strong>
                </Row>

                <Row className="justify-content-start">
                    <Col xs={1}>
                        ❑
                    </Col>
                    <Col xs={11} className="text-left">
                        <div>Are you trained in the Skill that applies to the roll?</div>
                    </Col>
                </Row>
                <Row className="justify-content-start">
                    <Col xs={1}>
                        ❑
                    </Col>
                    <Col xs={11} className="text-left">
                        <div>Do you have a Class Feature or Magic Item that helps?</div>
                    </Col>
                </Row>
                <Row className="justify-content-start">
                    <Col xs={1}>
                        ❑
                    </Col>
                    <Col xs={11} className="text-left">
                        <div>Are circumstances in your favor?</div>
                    </Col>
                </Row>

                <Row>
                <div><strong>After rolling: Spend a Derp Point to increase your result one level (Fail > Pass > Succeed > Critical)</strong></div>
                </Row>

                <Row className="mt-3">
                    <h3 className="rules-modal-header">HEALTH AND DAMAGE</h3>
                </Row>
                <Row className="mb-1">
                    <Col xs={4}>
                        <div>Minor Effect:<br/>1 Health</div>
                    </Col>
                    <Col xs={4}>
                        <div>Standard Effect:<br/>1d6 Health</div>
                    </Col>
                    <Col xs={4}>
                        <div>Critical Effect:<br/>Full Health</div>
                    </Col>
                </Row>

                <Row>
                    <Col xs={6} className="text-left">
                        <strong>Regular Consequences</strong>
                        <ul>
                            <li>1 Damage</li>
                            <li>Lose a standard item</li>
                            <li>+1 to a Countdown</li>
                            <li>Threatened (+1 Difficulty, Regular Consequences become Serious)</li>
                        </ul>
                    </Col>
                    <Col className="text-left">
                        <strong>Serious Consequences:</strong>
                        <ul>
                            <li>1d6 Damage</li>
                            <li>Lose a magic item</li>
                            <li>+2 to a Countdown</li>
                            <li>Things get way worse</li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <div>Escalate a Consequence to Serious or add a second Regular Consequence to add a Derp Point to the pool</div>
                </Row>

                <Row className="mt-3">
                    <h3 className="rules-modal-header">MAGIC FEATURES AND ITEMS</h3>
                </Row>
                <Row>
                    <p>When rolling or using class features, decide with the Director what the effect is based on the keywords rolled.</p>
                    <p>Magic Items are either good for one action, or last for one scene, agreed upon with the Director.</p>
                    <p>Wasting a Magic Item or Feature in an utterly useless fashion is treated as an Escalation.</p>
                </Row>
                <Row className="text-left">
                    <strong>1 cash item is worth:</strong>
                    <ul>
                        <li>3 standard items</li>
                        <li>1 magic item</li>
                        <li>Live the high life (gain 1 Exp + 1 Derp Point)</li>
                        <li>A hefty bribe</li>
                        <li>Any other substantial purchase or payment</li>
                    </ul>
                </Row>
                <Row>
                    <h3 className="rules-modal-header">DERP POINTS AND EXPERIENCE</h3>
                </Row>
                <Row className="text-left">
                    <div>When you take a Regular Consequence, you can add a Derp Point to the pool by <strong>Escalating</strong>:</div>
                </Row>
                <Row className="justify-content-start text-left">
                    <ul>
                        <li>Turn the Consequence into a Serious Consequence</li>
                        <li>Take a second Regular Consequence</li>
                    </ul>
                </Row>
                <Row className="text-left">
                    <div>Whenever you Escalate or your Derp creates a new Consequence, add a Derp Point to the pool. When the pool has Derp Points equal to the number of players, empty it and each player:</div>
                </Row>
                <Row className="justify-content-start text-left">
                    <ul className="text-left">
                        <li>Gains a Derp Point</li>
                        <li>Marks Experience</li>
                    </ul>
                </Row>
                <Row className="text-left">
                    <div>When returning to town, divide the number of Treasure items collected by the number of players rounded up. Each player gets that much cash to spend.</div>
                </Row>
                </Modal.Body>
            </div>
        </div>
        </Modal>
    )
}