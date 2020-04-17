import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import InviteComponent from './invite_component';
import { fetchCampaign } from '../../actions/campaign_actions';
import { fetchUsers } from '../../actions/user_actions';
import { createInvite } from '../../actions/invite_actions';

class Campaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subPending: null,
            usersList: [],
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
        this.userSubbed = this.userSubbed.bind(this);
        this.subRequested = this.subRequested.bind(this);
        this.requestSub = this.requestSub.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
    }

    componentDidMount() {
        fetchCampaign(this.props.match.params.id, this.loadCampaign).then(() => {
        fetchUsers((users) => this.setState({ usersList: users }))});
    }

    loadCampaign(loadedCampaign) {
        let newState = {};
        newState = Object.assign(newState, loadedCampaign);
        this.setState({ subPending: this.subRequested(newState.requested_invites), campaign: newState });
    }

    inviteUser(user) {
        if (user.id)
            createInvite({ requester_type: 'Campaign', requester_id: this.props.match.params.id, requested_type: 'User', requested_id: user.id });
    }

    userSubbed() {
        return this.state.campaign.subs.some(sub => sub.user_id === this.props.loggedInUser.id);
    }

    subRequested(invites) {
        return invites.some(invite => invite.requester_id == this.props.loggedInUser.id);
    }

    requestSub() {
        if (!this.userSubbed() && !this.state.subPending) {
            createInvite({ requester_type: 'User', requester_id: this.props.loggedInUser.id, requested_type: 'Campaign', requested_id: this.props.match.params.id });
            this.setState({ subPending: true })
        }
    }

    joinButton() {
        if (this.state.campaign.title === "") return;
        if (this.props.loggedInUser.id !== this.state.campaign.director.id) {
            const campaign = { title: this.state.campaign.title, id: this.props.match.params.id }
            if (this.userSubbed()) {
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
                <InviteComponent users={this.state.usersList} selector={this.inviteUser} />
            )
        }
    }

    render() {
        const { director } = this.state.campaign;
        return (
            <Container className="bg-light pl-5">
                <Row>
                    <h1 className="display-3">{this.state.campaign.title}</h1>
                </Row>
                <Row>
                    <div>Directed by: {director.id === this.props.loggedInUser.id ? "You" : director.username}</div>
                </Row>
                <Row>
                    <p><em>{this.state.campaign.description}</em></p>
                </Row>
                <Row>
                    {this.joinButton()}
                </Row>
                <Row>
                    <h3>Active Roster</h3>
                    <div>
                        <ul>
                            {this.state.campaign.alive_chars.map(character => {
                                return (
                                    <li key={character.id}>
                                        <Link to={`/ged/characters/${character.id}`}>
                                            <div>{character.name} Level {character.level} {character.c_class}</div>
                                        </Link>
                                        <div>Played by {character.player_name}</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </Row>
                <Row>
                    <h3>Graveyard</h3>
                    <div>
                        <ul>
                            {this.state.campaign.dead_chars.map(character => {
                                return (
                                    <li key={character.id}>
                                        <Link to={`/ged/characters/${character.id}`}>
                                            <div>{character.name} Level {character.level} {character.c_class}</div>
                                        </Link>
                                        <div>Played by {character.player_name}</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </Row>
            </Container>
        )
    }

}

export default Campaign;