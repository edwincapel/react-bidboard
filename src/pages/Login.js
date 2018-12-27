import React, {Component} from 'react'
import {Container} from 'reactstrap'
import {Link} from 'react-router-dom'
import axios from 'axios';

export default class Login extends Component {
    state={
        email:'',
        password:'',
        loggedin:false,
        loading:false,
    }

    logOut = () =>{
        sessionStorage.removeItem('authtoken')
        this.setState({loggedin:false})
        alert('Succesfully logged out!')
        window.location.href = ('/')
    }

    getJwt = (e) =>{
        e.preventDefault()
        axios.post('https://insta-oct18.nextacademy.com/api/v1/login',{
            email:this.state.email,
            password:this.state.password
        })
        .then(function (response) {
            const {data} = response;
            const {message, auth_token} = data
            // console.log(response)
            alert(message)
            window.location = ('/')
            sessionStorage.setItem("authtoken",auth_token)
            
        })
        .catch(function (error) {
            alert('Failed sign in, please try again');
        });
        this.setState({loggedin:true,loading:true})
        
    }

    handleEmail = (event) =>{
        const target = event.target
        const value = target.value
        
        this.setState({
            email : value
        })
        sessionStorage.setItem('email',value)
    }

    handlePassword = (event) =>{
        const target = event.target
        const value = target.value
        
        
        this.setState({
            password : value
        })
        
        sessionStorage.setItem('password',value)

        
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }
    render(){
        const jwt = sessionStorage.authtoken
        return(
            <div>
            <h1>LOGIN PAGE</h1>
            <Link to={'/'}>
                <p>Home</p>
            </Link>
            <Link to={'/signup'}>
                <p>Sign up</p>
            </Link>
            
            <form name='form' id='loginmodal' method='post' onSubmit={this.handleSubmit && this.getJwt}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input name='email' type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required onChange={this.handleEmail} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input name='password' type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" required  onChange={this.handlePassword}/>
                </div>
                <div className="form-check">
                </div>
                <button type="submit" className="btn btn-primary" /*disabled="!form.valid"*/>{this.state.loading === true ? 'Loading' : 'Submit' }</button>
                
            </form>
            </div>
        )
        
    }
}


