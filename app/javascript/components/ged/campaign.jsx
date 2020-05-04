import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DeleteCampaignModal from './delete_campaign_modal';
import InviteComponent from './invite_component';
import { fetchCampaign, updateCampaign } from '../../actions/campaign_actions';
import { fetchUsers } from '../../actions/user_actions';
import { createInvite, deleteInvite } from '../../actions/invite_actions';
import { CLASS_COLORS } from '../../dndb-tables';

class Campaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            campaignLoaded: false,
            editTitle: false,
            editDesc: false,
            tempString: "",
            errors: [],
            subPending: null,
            usersList: [],
            deleteModal: false,
            campaign: {
                title: "",
                description: "",
                director: {},
                alive_chars: [],
                dead_chars: [],
                subs: [],
                sent_invites: [],
                requested_invites: []
            }
        }
        this.loadCampaign = this.loadCampaign.bind(this);
        this.loadPlayers = this.loadPlayers.bind(this);
        this.userSubbed = this.userSubbed.bind(this);
        this.subRequested = this.subRequested.bind(this);
        this.requestSub = this.requestSub.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
        this.addInvite = this.addInvite.bind(this);
        this.findMyInviteId = this.findMyInviteId.bind(this);
        this.cancelInvite = this.cancelInvite.bind(this);
        this.clearRequest = this.clearRequest.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.updateTempString = this.updateTempString.bind(this);
        this.setErrors = this.setErrors.bind(this);
    }

    componentDidMount() {
        fetchCampaign(this.props.match.params.id, this.loadCampaign);
        fetchUsers({ 'campaign_id': this.props.match.params.id }, this.loadPlayers)
    }

    loadCampaign(loadedCampaign) {
        let newState = {};
        newState = Object.assign(newState, loadedCampaign);
        this.setState({ campaignLoaded: true, subPending: this.subRequested(newState.requested_invites, newState.sent_invites), campaign: newState });
    }

    loadPlayers(users) {
        this.setState({ usersList: users });
    }

    inviteUser(user) {
        if (this.userSubbed(user.id)) {
            return;    
        }
        let deleteId;
        this.state.campaign.sent_invites.forEach(invite => {
            if (invite.requested_id === user.id) {
                deleteId = invite.id;
                return;
            }
        });
        if (deleteId) return deleteInvite(deleteId, false, this.cancelInvite);
        createInvite({ requester_type: 'Campaign', requester_id: this.props.match.params.id, requested_type: 'User', requested_id: user.id }, this.addInvite);
    }

    leaveCampaign(user) {
        let newState = Object.assign({}, this.state.campaign)
        for (let i = 0; i < this.state.campaign.subs.length; i++) {
            if (this.state.campaign.subs[i].user_id === user.id) this.state.campaign.subs.splice(i, 1);
        }
        this.setState({ campaign: newState });
    }
    
    addInvite(invite) {
        let newState = Object.assign({}, this.state.campaign);
        newState.sent_invites.unshift({id: invite.id, requested_id: invite.requested.id, username: invite.requested.username, viewed: invite.viewed, created: invite.created_at});
        this.setState({ campaign: newState });
    }

    userSubbed(userId) {
        return this.state.campaign.subs.some(sub => sub.user_id === userId);
    }

    subRequested(sentInvites, receivedInvites) {
        if (sentInvites.some(invite => (invite.requester_id === this.props.loggedInUser.id))) {
            return "Requester"
        } else if (receivedInvites.some(invite => (invite.requested_id === this.props.loggedInUser.id))) {
            return "Requested"
        } else {
            return false
        }
    }

    requestSub() {
        if (!this.userSubbed(this.props.loggedInUser.id) && !this.state.subPending) {
            createInvite({ requester_type: 'User', requester_id: this.props.loggedInUser.id, requested_type: 'Campaign', requested_id: this.props.match.params.id }, this.addInvite);
            this.setState({ subPending: true })
        }
    }

    findMyInviteId() {
        const invites = this.state.campaign.requested_invites.concat(this.state.campaign.sent_invites)
        for (let i = 0; i < invites.length; i++) {
            if (invites[i].requester_id === this.props.loggedInUser.id || invites[i].requested_id === this.props.loggedInUser.id) return invites[i].id
        }
    }

    cancelInvite(invite) {
        let newState = Object.assign({}, this.state.campaign);
        for (let i = 0; i < newState.sent_invites.length; i++) {
            if (newState.sent_invites[i].id === invite.id) {
                newState.sent_invites.splice(i, 1);
            }
        }
        this.setState({ campaign: newState });
    }

    clearRequest(invite) {
        let newState = Object.assign({}, this.state.campaign);
        for (let i = 0; i < newState.requested_invites.length; i++) {
            if (newState.requested_invites[i].id === invite.id) {
                newState.requested_invites.splice(i, 1);
            }
        }
        this.setState({ campaign: newState });
    }

    allSubbedAndInvited() {
        let users = [];
        users = users.concat(this.state.campaign.subs.map(sub => sub.user_id));
        users = users.concat(this.state.campaign.sent_invites.map(invite => invite.requested_id));
        users = users.concat(this.state.campaign.requested_invites.map(invite => invite.requester_id));
        return users;
    }

    invitesDisp() {
        let sent;
        let requested;
        if (this.state.campaign.sent_invites.length > 0) {
            sent = (
                <Col xs={12} md={6}>
                    <div className="grenze">Pending Invitations</div>
                    <ListGroup>
                        {this.state.campaign.sent_invites.map(invite => {
                            return (
                                <ListGroup.Item key={invite.id}>
                                    <div>Username: <strong>{invite.username}</strong></div>
                                    <div>Invited: {invite.created}</div>
                                    <Button variant="danger" onClick={() => deleteInvite(invite.id, false, this.cancelInvite)}>Cancel</Button>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Col>
            )
        }
        if (this.state.campaign.requested_invites.length > 0) {
            requested = (
                <Col xs={12} md={6}>
                    <div className="grenze">Pending Join Requests</div>
                    <ListGroup>
                        {this.state.campaign.requested_invites.map(invite => {
                            return (
                                <ListGroup.Item key={invite.id}>
                                    <div>Username: <strong>{invite.username}</strong></div>
                                    <div>Requested: {invite.created}</div>
                                    <Button variant="success" onClick={() => deleteInvite(invite.id, false, this.clearRequest)}>Accept</Button>
                                    <Button variant="danger" onClick={() => deleteInvite(invite.id, false, this.clearRequest)}>Reject</Button>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Col>
            )
        }
        return <>{sent}{requested}</>
    }

    joinButton() {
        if (this.state.campaign.title === "") return;
        if (this.props.loggedInUser.id !== this.state.campaign.director.id) {
            const campaign = { title: this.state.campaign.title, id: this.props.match.params.id }
            if (this.userSubbed(this.props.loggedInUser.id)) {
                return (
                    <Link to={{ pathname: "/ged/characters/new", state: campaign }}><Button>
                        + Create New Character
                    </Button></Link>
                )
            }
            else if (this.state.subPending) {
                return (
                    <>
                    {this.state.subPending === "Requested" ?
                    <Button variant="success" onClick={() => deleteInvite(this.findMyInviteId(), true, this.cancelInvite)}>
                        Join Campaign
                    </Button>
                    :
                    <Button disabled>
                        Request Pending
                    </Button>
                    }</>
                )
            } else {
                return (
                    <Button onClick={this.requestSub}>
                        Ask to Join Campaign
                    </Button>
                )
            }
        } else {
            return (
                <>
                <Col xs={12}>
                    <InviteComponent campaignId={this.props.match.params.id} selector={this.inviteUser} selectedIds={this.allSubbedAndInvited()} loggedInUser={this.props.loggedInUser} />
                </Col>
                {this.invitesDisp()}
                </>
            )
        }
    }

    openEdit(title) {
        if (this.state.campaign.director.id === this.props.loggedInUser.id) {
            if (title) {
                this.setState({ editTitle: true, editDesc: false, tempString: this.state.campaign.title })
            } else {
                this.setState({editDesc: true, editTitle: false, tempString: this.state.campaign.description})
            }
        }
    }

    closeEdit(title) {
        let newState = Object.assign({}, this.state.campaign);
        if (title) {
            newState.title = this.state.tempString;
        } else {
            newState.description = this.state.tempString;
        }
        updateCampaign(newState, (newCampaign) => this.setState({ editDesc: false, editTitle: false, tempString: "", campaign: newCampaign }), this.setErrors);
    }

    updateTempString(e) {
        this.setState({ 'tempString': e.currentTarget.value })
    }

    setErrors(errors) {
        this.setState({errors: errors});
    }

    titleDisp() {
        if (this.state.editTitle) {
            return (
                <Form>
                    <InputGroup>
                        <Form.Control value={this.state.tempString} onChange={this.updateTempString} />
                    </InputGroup>
                    <InputGroup.Append>
                        <Button onClick={() => this.closeEdit(true)} variant="success">Update</Button>
                        <Button onClick={() => this.setState({editTitle: false, tempString: ""})} variant="danger">Cancel</Button>
                    </InputGroup.Append>
                </Form>
            )
        } else {
            return (
                <h1 className="display-3 d-inline" onClick={() => this.openEdit(true)}>{this.state.campaign.title}</h1>
            )
        }
    }

    descriptionDisp() {
        if (this.state.editDesc) {
            return (
                <Form>
                    <InputGroup>
                        <Form.Control as="textarea" rows="3" value={this.state.tempString} onChange={this.updateTempString} />
                    </InputGroup>
                    <InputGroup.Append>
                        <Button onClick={() => this.closeEdit(false)} variant="success">Update</Button>
                        <Button onClick={() => this.setState({ editDesc: false, tempString: "" })} variant="danger">Cancel</Button>
                    </InputGroup.Append>
                </Form>
            )
        } else if (this.state.campaign.description) {
            return (
                <p onClick={() => this.openEdit(false)}><em>{this.state.campaign.description}</em></p>
            )
        } else if (this.state.campaign.director.id === this.props.loggedInUser.id) {
            return (
                <Button onClick={() => this.openEdit(false)} variant="secondary">Add Description</Button>
            )
        }
    }

    render() {
        const { director } = this.state.campaign;
        const userDirecting = director.id === this.props.loggedInUser.id;
        const subs = this.state.campaign.subs;
        const graveyard = this.state.campaign.dead_chars;
        if (!this.state.campaignLoaded) {
            return (
                <Container style={{ height: '92vh' }} className="d-flex bg-light w-100 justify-content-center align-items-center">
                    <h1>Loading Campaign...</h1>
                    <Spinner animation="grow" role="status" variant="dark" />
                </Container>
            )
        }
        return (
            <Container className="bg-light pl-5">
                <DeleteCampaignModal show={this.state.deleteModal} onHide={() => this.setState({ deleteModal: false })}
                    quitting={this.state.campaign.director.id !== this.props.loggedInUser.id}
                    campaignId={this.props.match.params.id}
                    loggedInUser={this.props.loggedInUser}
                    leaveCampaign={this.leaveCampaign}
                />
                <Row>
                {this.titleDisp()}
                </Row>
                <Row className="mb-3 justify-content-between">
                    <div>Directed by: {userDirecting ? "You" : director.username}</div>
                    <Button variant="danger" onClick={() => this.setState({ deleteModal: true })}>
                        {userDirecting ? "Delete Campaign" : "Quit Campaign"}
                    </Button>
                </Row>
                <Row>
                    {this.descriptionDisp()}
                </Row>
                <Row>
                    {this.joinButton()}
                </Row>
                <Row className="my-4">
                    <Col xs={12} md={6} className="mb-3">
                        <Row>
                            <h2>Active Roster</h2>
                        </Row>
                        <Row>
                            <ListGroup>
                                {subs.map(sub => {
                                    if (sub.is_director) return null;
                                    return (
                                        <div key={sub.id}>
                                        <h3 className="ml-3" style={{textDecoration: 'underline'}}>{sub.username}</h3>
                                        {sub.characters.map((char) => {
                                            return (
                                                <Link key={char.id} to={`/ged/characters/${char.id}`}>
                                                    <ListGroup.Item>
                                                        <div style={{color: CLASS_COLORS[char.c_class]}}>{char.name} Level {char.level} {char.c_class}</div>
                                                    </ListGroup.Item>
                                                </Link>
                                            )
                                        })}
                                        </div>
                                    )
                                })}
                            </ListGroup>
                        </Row>
                    </Col>
                    <Col xs={12} md={6}>
                        <Row>
                            <h2>Graveyard</h2>
                        </Row>
                        <Row>
                            <ListGroup>
                                {graveyard.map(character => {
                                    return (
                                        <Link key={character.id} to={`/ged/characters/${character.id}`}>
                                            <ListGroup.Item>
                                                <div style={{ color: CLASS_COLORS[character.c_class] }}>{character.name} Level {character.level} {character.c_class}</div>
                                                <div>Played by {character.player_name}</div>
                                            </ListGroup.Item>
                                        </Link>
                                    )
                                })}
                            </ListGroup>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default Campaign;