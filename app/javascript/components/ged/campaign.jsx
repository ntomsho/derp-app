import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCampaign } from '../../actions/campaign_actions';
import { createInvite, deleteInvite } from '../../actions/invite_actions';

class Campaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subPending: null,
            campaign: {
                title: "",
                description: "",
                director: {},
                characters: [],
                subs: [],
                sent_invites: [],
                requested_invites: []
            }
        }
        this.loadCampaign = this.loadCampaign.bind(this);
        this.userSubbed = this.userSubbed.bind(this);
        this.subRequested = this.subRequested.bind(this);
        this.requestSub = this.requestSub.bind(this);
    }

    componentDidMount() {
        fetchCampaign(this.props.match.params.id, this.loadCampaign);
    }

    loadCampaign(loadedCampaign) {
        let newState = {};
        newState = Object.assign(newState, loadedCampaign);
        this.setState({ subPending: this.subRequested(newState.requested_invites), campaign: newState });
    }

    userSubbed() {
        return this.state.campaign.subs.some(sub => sub.user_id === this.props.loggedInUser.id);
    }

    subRequested(invites) {
        return invites.some(invite => invite.id == this.props.loggedInUser.id);
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
                    <Link to={{ pathname: "/ged/characters/new", state: campaign }}><button>
                        Create New Character
                    </button></Link>
                )
            }
            else {
                return (
                    <button onClick={this.requestSub}>
                        {this.state.subPending ? "Request Pending" : "Ask to Join Campaign"}
                    </button>
                )
            }
        }
    }

    render() {
        return (
            <div id="campaign-background">
                <h2>{this.state.campaign.title}</h2>
                <div>Directed by: {this.state.campaign.director.username}</div>
                <div>{this.state.campaign.description}</div>
                {this.joinButton()}
                <h3>Active Roster</h3>
                <div>
                    <ul>
                        {this.state.campaign.characters.map(character => {
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
            </div>
        )
    }

}

export default Campaign;