import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCampaign } from '../../actions/campaign_actions';

class Campaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            director: {},
            characters: [],
            subs: []
        }
        this.loadCampaign = this.loadCampaign.bind(this);
        this.userSubbed = this.userSubbed.bind(this);
    }

    componentDidMount() {
        fetchCampaign(this.props.match.params.id, this.loadCampaign)
    }

    loadCampaign(campaign) {
        let newState = {};
        newState = Object.assign(newState, campaign);
        this.setState(newState);
    }

    userSubbed() {
        return this.state.subs.some(sub => sub.user_id === this.props.loggedInUser.id);
    }

    joinButton() {
        if (this.state.title === "") return;
        if (this.props.loggedInUser.id !== this.state.director.id) {
            const campaign = { title: this.state.title, id: this.props.match.params.id }
            return (
                <Link to={{ pathname: "/ged/characters/new", state: campaign }}><button>
                    {this.userSubbed() ? "Create New Character" : "Join Campaign"}
                </button></Link>
            )
        }
    }

    render() {
        return (
            <div id="campaign-background">
                <h2>{this.state.title}</h2>
                <div>Directed by: {this.state.director.username}</div>
                <div>{this.state.description}</div>
                {this.joinButton()}
                <h3>Active Roster</h3>
                <div>
                    <ul>
                        {this.state.characters.map(character => {
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