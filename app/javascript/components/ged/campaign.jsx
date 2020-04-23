import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import DeleteCampaignModal from './delete_campaign_modal';
import InviteComponent from './invite_component';
import { fetchCampaign } from '../../actions/campaign_actions';
import { fetchUsers } from '../../actions/user_actions';
import { createInvite, deleteInvite } from '../../actions/invite_actions';
import { CLASS_COLORS } from '../../dndb-tables';

//Add delete campaign button

class Campaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.findPlayer = this.findPlayer.bind(this);
        this.cancelInvite = this.cancelInvite.bind(this);
        this.clearRequest = this.clearRequest.bind(this);
    }

    componentDidMount() {
        fetchCampaign(this.props.match.params.id, this.loadCampaign);
        fetchUsers({ 'campaign_id': this.props.match.params.id }, this.loadPlayers)
    }

    loadCampaign(loadedCampaign) {
        let newState = {};
        newState = Object.assign(newState, loadedCampaign);
        this.setState({ subPending: this.subRequested(newState.requested_invites), campaign: newState });
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
    
    addInvite(invite) {
        let newState = Object.assign({}, this.state.campaign);
        newState.sent_invites.unshift({id: invite.id, requested_id: invite.requested.id, username: invite.requested.username, viewed: invite.viewed, created: invite.created_at});
        this.setState({ campaign: newState });
    }

    userSubbed(userId) {
        return this.state.campaign.subs.some(sub => sub.user_id === userId);
    }

    subRequested(invites) {
        return invites.some(invite => invite.requester_id === this.props.loggedInUser.id);
    }

    requestSub() {
        if (!this.userSubbed(this.props.loggedInUser.id) && !this.state.subPending) {
            createInvite({ requester_type: 'User', requester_id: this.props.loggedInUser.id, requested_type: 'Campaign', requested_id: this.props.match.params.id }, this.addInvite);
            this.setState({ subPending: true })
        }
    }

    findPlayer(userId) {
        for (let i = 0; i < this.state.usersList.length; i++) {
            if (this.state.usersList[i].id === userId) return this.state.usersList[i].username;
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
            else {
                return (
                    <button onClick={this.requestSub}>
                        {this.state.subPending ? "Request Pending" : "Ask to Join Campaign"}
                    </button>
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

    render() {
        const { director } = this.state.campaign;
        const userDirecting = director.id === this.props.loggedInUser.id
        return (
            <Container className="bg-light pl-5">
                <DeleteCampaignModal show={this.state.deleteModal} onHide={() => this.setState({ deleteModal: false })} campaignId={this.props.match.params.id} />
                <Row>
                    <h1 className="display-3">{this.state.campaign.title}</h1>
                </Row>
                <Row className={`mb-3 ${userDirecting ? "justify-content-between" : ""}`}>
                    <div>Directed by: {userDirecting ? "You" : director.username}</div>
                    {userDirecting ? 
                        <Button variant="danger" onClick={() => this.setState({ deleteModal: true })}>
                            Delete Campaign
                        </Button>
                        : null}
                </Row>
                <Row>
                    <p><em>{this.state.campaign.description}</em></p>
                </Row>
                <Row>
                    {this.joinButton()}
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <Row>
                            <h3>Active Roster</h3>
                        </Row>
                        <Row>
                            <ListGroup>
                                {this.state.campaign.alive_chars.map(character => {
                                    return (
                                        <Link key={character.id} to={`/ged/characters/${character.id}`}>
                                            <ListGroup.Item>
                                                <div style={{color: CLASS_COLORS[character.c_class]}}>{character.name} Level {character.level} {character.c_class}</div>
                                                <div>Played by {this.findPlayer(character.user_id)}</div>
                                            </ListGroup.Item>
                                        </Link>
                                    )
                                })}
                            </ListGroup>
                        </Row>
                    </Col>
                    <Col xs={12} md={6}>
                        <Row>
                            <h3>Graveyard</h3>
                        </Row>
                        <Row>
                            <ListGroup>
                                {this.state.campaign.dead_chars.map(character => {
                                    return (
                                        <Link key={character.id} to={`/ged/characters/${character.id}`}>
                                            <ListGroup.Item>
                                                <div style={{ color: CLASS_COLORS[character.c_class] }}>{character.name} Level {character.level} {character.c_class}</div>
                                                <div>Played by {this.findPlayer(character.user_id)}</div>
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