import React, {Component} from 'react'
import {Container} from 'reactstrap'
import {Link} from 'react-router-dom'

export default class SignUp extends Component {
    render(){
        return(            
            <Container>
                <h1>SIGN UP PAGE</h1>
                <Link to={'/'}>
                    <p>Home</p>
                </Link>
                <Link to={'/login'}>
                    <p>Login</p>
                </Link>
            </Container>
        )
    }
}


