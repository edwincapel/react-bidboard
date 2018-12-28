import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios';
import {Container,Col,Row,Form,FormGroup,Input,Button} from 'reactstrap'
import Background from '../images/login.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVrCardboard } from '@fortawesome/free-solid-svg-icons'

const leftBg = {
    backgroundImage: `url(${Background})`,
}

export default class SignUp extends Component {
    state={
        email:'',
        password:'',
        firstname:'',
        lastname:'',
        companyname:'',
        message:'',
        loading:false,
        hasError:false,
        errors:[],
    }

    postCredentials = (e) =>{
        e.preventDefault()
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/users/create',
            headers: {
                'content-type': 'application/json',
            },
            data: {
                first_name:this.state.firstname,
                last_name:this.state.lastname,
                email:this.state.email,
                company_name:this.state.companyname,
                password:this.state.password,
            }
          })
        .then( response => {
            console.log(response)
            const {data} = response;
            const {message, auth_token} = data
            sessionStorage.setItem('jwt',auth_token)
            this.setState({message:message})
        })
        .catch(catcherror => {
            const {response} = catcherror
            
            this.setState({hasError: true,errors: response.data.message })
        });    
    }

    handleEmail = (event) =>{
        const target = event.target
        const value = target.value
        this.setState({
            email : value
        })
    }

    handleFirstName = (event) =>{
        const target = event.target
        const value = target.value
        
        this.setState({
            firstname : value
        })
    }

    handleLastName = (event) =>{
        const target = event.target
        const value = target.value
        
        this.setState({
            lastname : value
        })
    }

    handleCompanyName = (event) =>{
        const target = event.target
        const value = target.value
        
        this.setState({
            companyname : value
        })
    }

    handlePassword = (event) =>{
        const target = event.target
        const value = target.value
        
        this.setState({
            password : value
        })
        
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render(){
        if(sessionStorage.jwt){
            return <Redirect to= '/'/>
        }
        else{ 
        return(
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
                                <h1>Sign Up</h1>
                                <p>Hello! Let's get started by making your account!</p>
                            </div>
                            <Form className="mb-auto w-100 p-5" onSubmit={this.handleSubmit && this.postCredentials}>
                                <FormGroup>
                                    <Input onInput={this.handleFirstName}
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        name = "firstname" 
                                        placeholder ="First Name"
                                        required
                                    />
                                    <Input onChange={this.handleLastName}
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        name = "lastname" 
                                        placeholder ="Last Name"
                                        required
                                    />
                                    <Input onChange={this.handleEmail}
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        name = "email" 
                                        type='email'
                                        placeholder ="Email"
                                        required
                                    />
                                    <Input onChange={this.handleCompanyName}
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        name = "companyname" 
                                        placeholder ="Company Name"
                                        required
                                    />
                                    <Input onChange = {this.handlePassword}
                                        type='password'
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        name = "password" 
                                        placeholder ="Password"
                                        required
                                    />
                                    <div className="d-flex flex-row mt-3 ml-1">
                                        <Button className="btn btn-dark" value="Login">
                                            Sign Up
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
                            <div>
                                <h6>
                                {this.state.hasError === true ? this.state.errors.map((errors,index) =>
                                <li key = {index}>{errors}</li>) 
                                : this.state.message}
                                </h6>
                            </div>
                            <div className="mt-auto mx-auto mb-3">
                                <small className="text-muted">
                                    Already have an account? Login &nbsp;
                                    <Link to={'/login'} className="text-muted border-bottom">
                                        here!
                                    </Link> 
                                </small>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        )
                                }
    }
    }


