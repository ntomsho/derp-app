import React, { useState } from 'react';
import {
    Route,
    Switch,
    Redirect,
    BrowserRouter
} from 'react-router-dom';
import PrivateRoute from '../route_utils';
import NavbarComp from './navbar';
import Home from './Home';
import GEDHome from './ged/ged_home';
import CharGen from './char_gen/char_gen';
import CharacterMain from './ged/character_main';
import Campaign from './ged/campaign';
import CampaignNew from './ged/campaign_new';
import DeadPage from './dead_page';

const App = () => {
    
    const [loggedInUser, setLoggedInUser] = useState(window.currentUser || null)

    return (
        <BrowserRouter>
            <header>
                {loggedInUser ? <NavbarComp loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> : null}
            </header>
            <Switch>
                <PrivateRoute path="/ged/campaigns/new" component={CampaignNew} loggedInUser={loggedInUser} />} />
                <PrivateRoute path="/ged/campaigns/:id" component={Campaign} loggedInUser={loggedInUser} />} />
                <PrivateRoute path="/ged/characters/new" component={CharGen} loggedInUser={loggedInUser} />} />
                <PrivateRoute path="/ged/characters/:id" component={CharacterMain} loggedInUser={loggedInUser} />} />
                <PrivateRoute path="/ged" component={GEDHome} loggedInUser={loggedInUser} />} />
                <Route path="/" component={Home} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
                <Route component={DeadPage} />
            </Switch>
        </BrowserRouter>
    )
}

export default App;