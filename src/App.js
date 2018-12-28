import React, { Component, Fragment } from 'react';
import './App.scss';
import axios from 'axios'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import {Route, Switch} from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
        current_user: {}
    }
  }

  componentDidMount(){
      axios({
        method: 'get',
        url: 'http://localhost:5000/api/v1/users/me',
        headers: {
          'authorization': `Bearer ${localStorage.jwt}`
        }
      })
      .then(({data}) => {
        this.setState({
          current_user:data
        })
      })
      .catch(error => {
        console.log('ERROR: ', error); 
      })
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
