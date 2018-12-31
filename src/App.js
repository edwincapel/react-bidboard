import React, { Component, Fragment } from 'react';
import './App.scss';
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NewAdvertisement from './pages/NewAdvertisement';
import {Route, Switch} from 'react-router-dom'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render(){
    return (
      <Fragment>
        <div className = "content">
          <Switch>
            <Route path="/login" 
              component = { props => 
                      {
                        return (
                          <Login 
                            {...props}
                          />
                        )
                      }
              }
            />
            {/* <Route path="/upload" 
              component ={ProfilePage}
            />   */}
            <Route path="/signup" 
              component = { props => 
                      {
                        return (
                          <SignUp 
                            {...props}
                          />
                        )
                      }
              }
            />    
            <Route path="/new" 
              component = { props => 
                      {
                        return (
                          <NewAdvertisement 
                            {...props}
                          />
                        )
                      }
              }
            />       
            <Route path="/" 
              component = { props => 
                      {
                        return (
                          <Home 
                          {...props}
                          />
                        )
                      }
              }
            />
          </Switch>
        </div>
      </Fragment>
    )
  }
}

export default App;
