import React, {Component} from 'react'
import {Container,Button} from 'reactstrap'
import {Link} from 'react-router-dom'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: JSON.parse(localStorage.getItem('currentUser'))
        }
    }

    logout = () => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('currentUser')
        this.forceUpdate()
    }

    render(){
        const {currentUser} = this.state
        
        return(    
            
            <Container>
                <h1>HOME PAGE</h1>
                <br/>
                <br/>
                
                {localStorage.jwt 
                ? 
                <div>
                    <p>Hello, {currentUser.first_name}</p>
                    
                    <Button onClick={this.logout}>
                        Logout
                    </Button>
                </div>
                : 
                <div>
                    <Link to={'/login'}>
                        <p>Login</p>
                    </Link>
                    <Link to={'/signup'}>
                        <p>Sign up</p>
                    </Link>
                </div>
                }
            </Container>
        )
    }
}


