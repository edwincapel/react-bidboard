import React, {Component} from 'react'
import {Container,Col,Row,Form,FormGroup,Input,Button} from 'reactstrap'
import {Link} from 'react-router-dom'
import Background from '../images/login.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVrCardboard } from '@fortawesome/free-solid-svg-icons'

const leftBg = {
    backgroundImage: `url(${Background})`,
}

export default class Login extends Component {
    render(){
        return(
            // LOGIN SECTION
            <section className="h-100" id="login-page">
                <Container fluid className="h-100">
                    <Row className="h-100">
                        <Col md="7" className="h-100 d-none d-md-block" id="login-left-banner" style={leftBg}>
                            <div className="mb-auto mt-3">
                                <h3>LOGO</h3>
                            </div>
                        </Col>
                        <Col md="5" className="h-100 d-flex align-items-start flex-column" id="login-right-banner">
                            <div className="mb-auto m-5">
                                <h1>Login</h1>
                                <p>Hello! Let's get started!</p>
                            </div>
                            <Form className="mb-auto w-100 p-5">
                                <FormGroup>
                                    <Input 
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        name = "email" 
                                        placeholder ="email"
                                    />
                                    <Input 
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        name = "password" 
                                        placeholder ="password"
                                    />
                                    <div className="d-flex flex-row mt-3 ml-1">
                                        <Button className="btn btn-dark" value="Login">
                                            Login
                                        </Button>
                                        
                                        <a 
                                        href="#" 
                                        className="btn btn-primary h-50 ml-1" id="google-button"
                                        >
                                            <FontAwesomeIcon className="fab fa-google" icon={faVrCardboard}/>
                                        </a>
                                    </div>
                                </FormGroup>
                            </Form>
                            <div className="mt-auto mx-auto mb-3">
                                <small className="text-muted">
                                    Don't have an account yet? Sign up&nbsp;
                                    <Link to={'/signup'} className="text-muted border-bottom">
                                        here!
                                    </Link> 
                                </small>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            // /LOGIN SECTION  
        )
        
    }
}


