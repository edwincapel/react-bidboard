import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios';
import {Container,Col,Row,Form,FormGroup,Input,Button} from 'reactstrap'
import Background from '../images/login.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVrCardboard } from '@fortawesome/free-solid-svg-icons'



export default class SignUp extends Component {
    state={
        "campaign_name": "Next Marketing",
        "description": "Marketing for Jan intake",
        "user_media": '',
        
    }

    postMedia = (e) =>{
        e.preventDefault()
        const {id} = this.props.match.params
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/media/upload',
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.jwt}`
            },
            data: {
                "campaign_name": this.state.campaign_name,
                "description": this.state.description,
                "user_media": this.state.user_media,
                'user_id': id
            }
          })
        .then( response => {
            // console.log(response)
            const {data} = response;
            const {message, auth_token} = data
            sessionStorage.setItem('jwt',auth_token)
            this.setState({loggedin:true,message:message})
        })
        .catch(catcherror => {
            const {response} = catcherror
            
            this.setState({hasError: true,errors: response.data.message })
        });    
    }

    handleCampaignName = (event) =>{
        const target = event.target
        const value = target.value
        this.setState({
            campaign_name : value
        })
    }

    handleDescription = (event) =>{
        const target = event.target
        const value = target.value
        
        this.setState({
            description : value
        })
    }

    handleUserMedia = (event) =>{
        const target = event.target
        const value = target.value
        
        this.setState({
            user_media: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render(){
        return(
            <section className="h-100" id="login-page">
                <Container fluid className="h-100">
                    <Row className="h-100">
                        <Col md="5" className="h-100 d-flex align-items-start flex-column" id="login-right-banner">
                            <Form className="mb-auto w-100 p-5" onSubmit={this.handleSubmit && this.postMedia}>
                                <FormGroup>
                                    <Input onInput={this.handleCampaignName}
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        placeholder ="Campaign Name"
                                        required
                                    />
                                    <Input onChange={this.handleDescription}
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        placeholder ="Description"
                                        required
                                    />
                                    <Input onChange={this.handleUserMedia}
                                        className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                        type='file'
                                        required
                                    />
                    
                                    <div className="d-flex flex-row mt-3 ml-1">
                                        <Button className="btn btn-dark" value="Login">
                                            Upload
                                        </Button>                                       
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
                        </Col>
                    </Row>
                </Container>
            </section>
        )
        
    }
    }