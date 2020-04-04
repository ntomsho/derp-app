import React from 'react';
import {
    Route,
    Redirect,
    Switch,
    Link,
    HashRouter
} from 'react-router-dom';
import Home from './Home'
import GEDHome from './ged/ged_home'

const App = () => (
    <HashRouter>
        <Switch>
            <Route path="/ged" component={GEDHome} />
            <Route path="/" component={Home} />
        </Switch>
    </HashRouter>
)

export default App;