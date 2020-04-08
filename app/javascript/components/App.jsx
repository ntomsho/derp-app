import React from 'react';
import {
    Route,
    Redirect,
    Switch,
    Link,
    HashRouter
} from 'react-router-dom';
import Home from './Home';
import GEDHome from './ged/ged_home';
import CharGen from './char_gen/char_gen';
import CharacterMain from './ged/character_main';

const App = () => (
    <HashRouter>
        <Switch>
            <Route path="/ged/characters/new" component={CharGen} />
            <Route path="/ged/characters/:id" component={CharacterMain} />
            <Route path="/ged" component={GEDHome} />
            <Route path="/" component={Home} />
        </Switch>
    </HashRouter>
)

export default App;