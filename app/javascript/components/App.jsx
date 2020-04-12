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

const App = () => {
    
    const [loggedInUser, setLoggedInUser] = useState(window.currentUser || null)

    return (
        <HashRouter>
            <header>
                <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            </header>
            <Switch>
                {
                    //Change these all to render methods so that they can pick up loggedInUser
                }
                <Route path="/ged/characters/new" component={CharGen} />
                <Route path="/ged/characters/:id" component={CharacterMain} />
                <Route path="/ged" component={GEDHome} />
                <Route path="/" render={() => <Home loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
            </Switch>
        </HashRouter>
    )
}

export default App;