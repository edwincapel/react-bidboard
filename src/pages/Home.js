import React, {Component} from 'react'
import {Container,Row} from 'reactstrap'
import SideNavbar from '../components/SideNavbar'
import Dashboard from '../components/Dashboard';
import {Redirect} from 'react-router-dom'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: JSON.parse(localStorage.getItem('currentUser'))
        }
    }

    logout = (e) => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('currentUser')
        this.forceUpdate()
    }

    render(){
        const {currentUser} = this.state
        
        if (localStorage.getItem('jwt')) {
            return(    
                // Dashboard SECTION
                <section className="h-100" id="dashboard"> 
                    <Container fluid>
                        <Row>
                            <SideNavbar logout={this.logout}/>
                            <Dashboard />
                        </Row>
                    </Container>
                </section>
            )
        }
        else{
            return <Redirect to='/login'/>;
        }

    }
}


