import React, {Component} from 'react'
import {Alert,Container,Col,Row,Form,FormGroup,Input,Button} from 'reactstrap'
import {Link,Redirect} from 'react-router-dom'
import * as EmailValidator from 'email-validator'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVrCardboard } from '@fortawesome/free-solid-svg-icons'


export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            emailValue: "",
            passwordValue: "",
            isLoading: false,
            hasError:false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const validateEmail = EmailValidator.validate(this.state.emailValue)
        if (validateEmail){
            axios.post('http://localhost:5000/api/v1/login', {
                email: this.state.emailValue,
                password: this.state.passwordValue
              })
              .then(response => {
                const jwt = response.data.auth_token
                const user = response.data.user
                localStorage.setItem('jwt', jwt)
                localStorage.setItem('currentUser',JSON.stringify(user))
                this.setState({
                    isLoading: false,
                })
              })
              .catch(error => {
               console.log(error)
               this.setState({hasError:true})
              });
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    handleEmailChange = (e) => {
        this.setState({emailValue: e.target.value})
    }
    handlePasswordChange = (e) => {
        this.setState({passwordValue: e.target.value})
    }

    render(){ 
            if (localStorage.getItem('jwt')) {
                return <Redirect to='/'/>;
            }
            else{
                return(
                // LOGIN SECTION
                <section className="h-100" id="login-page">
                    <Container fluid className="h-100">
                        <Row className="h-100">
                            <Col md="7" className="h-100 d-none d-md-block" id="login-left-banner" >
                                <div className="mb-auto mt-3">
                                    
                                </div>
                            </Col>
                            <Col md="5" className="h-100 d-flex align-items-start flex-column" id="login-right-banner">
                                <div className="mb-auto m-5">
                                    <h1>Login</h1>
                                    <p>Hello! Let's get started!</p>
                                </div>
                                <Form className="mb-auto w-100 p-5" onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Input 
                                            className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                            name = "email"
                                            type='email' 
                                            placeholder ="email"
                                            value={this.state.emailValue}
                                            onChange={this.handleEmailChange}
                                        />
                                        <Input 
                                            className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                            name = "password"
                                            type ="password"
                                            autoComplete="password" 
                                            placeholder ="password"
                                            value={this.state.passwordValue} 
                                            onChange={this.handlePasswordChange}
                                            required
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
                                {this.state.hasError === true ? <Alert color='danger'>Email and Passwords don't match</Alert> : ''}
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
}


