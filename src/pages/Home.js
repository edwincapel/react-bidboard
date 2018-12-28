import React, {Component} from 'react'
import {Container} from 'reactstrap'
import {Link} from 'react-router-dom'

export default class Home extends Component {
    render(){
        return(            
            <Container>
                <h1>HOME PAGE</h1>

                <br/>
                <br/>
                
                <Link to={'/login'}>
                    <p>Login</p>
                </Link>
                <Link to={'/signup'}>
                    <p>Sign up</p>
                </Link>
            </Container>
        )
    }
}


