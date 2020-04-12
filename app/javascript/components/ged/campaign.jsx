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
            characters: []
        }
        this.loadCampaign = this.loadCampaign.bind(this);
    }

    componentDidMount() {
        fetchCampaign(this.props.match.params.id, this.loadCampaign)
    }

    loadCampaign(campaign) {
        let newState = {};
        newState = Object.assign(newState, campaign);
        this.setState(newState);
    }

    render() {
        return (
            <div id="campaign-background">
                <h2>{this.state.title}</h2>
                <div>Directed by: {this.state.director.username}</div>
                <div>{this.state.description}</div>
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