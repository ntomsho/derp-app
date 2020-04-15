import React, { useState } from 'react';
import {
    Route,
    Redirect,
    Switch,
    HashRouter
} from 'react-router-dom';
import Navbar from './navbar';
import Home from './Home';
import GEDHome from './ged/ged_home';
import CharGen from './char_gen/char_gen';
import CharacterMain from './ged/character_main';
import Campaign from './ged/campaign';
import CampaignNew from './ged/campaign_new';

const App = () => {
    
    const [loggedInUser, setLoggedInUser] = useState(window.currentUser || null)

    return (
        <HashRouter>
            <header>
                {loggedInUser ? <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> : null}
            </header>
            <Switch>
                {
                    //Change these all to render methods so that they can pick up loggedInUser
                }
                <Route exact path="/ged/campaigns/new" render={(props) => <CampaignNew {...props} loggedInUser={loggedInUser} />} />
                <Route path="/ged/campaigns/:id" render={(props) => <Campaign {...props} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
                <Route exact path="/ged/characters/new" render={(props) => <CharGen {...props} />} />
                <Route path="/ged/characters/:id" component={CharacterMain} />
                <Route path="/ged" component={GEDHome} />
                <Route path="/" render={(props) => <Home {...props} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
            </Switch>
        </HashRouter>
    )
}

export default App;