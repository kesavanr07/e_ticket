import React, {Component} from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Login from './Login.js'
import Registration from './Registration.js'
import ManageTrains from './adminpanel/ManageTrains.js'
import Dashboard from './ticket/Dashboard.js'
import "./App.css";


class App extends Component {
  state = {
    userData: []
  }

  render() {
    // const { userData } = this.state;
    return (
      <div className="container">
          <Router>
              <Switch>
                  <Route exact path={["/","/login"]} component={Login} />
                  <Route exact path="/register" component={Registration} />
                  <Route exact path="/admin_panel" component={ManageTrains} />
                  <Route exact path="/dashboard" component={Dashboard} />
              </Switch>
          </Router>
      </div>
    )
  }
}

export default App;
