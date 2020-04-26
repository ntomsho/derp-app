import React, { useState } from 'react';
import {
    Route,
    Switch,
    BrowserRouter
} from 'react-router-dom';
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
                <Route exact path="/ged/campaigns/new" render={(props) => <CampaignNew {...props} loggedInUser={loggedInUser} />} />
                <Route path="/ged/campaigns/:id" render={(props) => <Campaign {...props} loggedInUser={loggedInUser} />} />
                <Route exact path="/ged/characters/new" render={(props) => <CharGen {...props} loggedInUser={loggedInUser} />} />
                <Route exact path="/ged/characters/:id" render={(props) => <CharacterMain {...props} loggedInUser={loggedInUser} /> } />
                <Route path="/ged" render={(props) => <GEDHome {...props} loggedInUser={loggedInUser} />} />
                <Route exact path="/" render={(props) => <Home {...props} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
                <Route component={DeadPage} />
            </Switch>
        </BrowserRouter>
    )
}

export default App;