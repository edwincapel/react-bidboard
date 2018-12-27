import React, {Component} from 'react'
import {Container} from 'reactstrap'
import {Link} from 'react-router-dom'

export default class Login extends Component {
    render(){
        return(            
            <Container>
                <h1>LOGIN PAGE</h1>
                <Link to={'/'}>
                    <p>Home</p>
                </Link>
                <Link to={'/signup'}>
                    <p>Sign up</p>
                </Link>
            </Container>
        )
    }
}


