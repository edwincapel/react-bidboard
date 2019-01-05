import React, {Component} from 'react'
import {Container,Row} from 'reactstrap'
import SideNavbar from '../components/SideNavbar'
import NewAd from '../containers/NewAd';
import {Redirect} from 'react-router-dom'

export default class NewAdvertisement extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: JSON.parse(localStorage.getItem('currentUser')),
            currentUrl: this.props.match.path
        }
    }

    logout = () => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('currentUser')
        this.forceUpdate()
    }

    render(){
        const {currentUser,currentUrl} = this.state
        
        if (localStorage.getItem('jwt')) {
            return(
                <section className="h-100" id="dashboard"> 
                    <Container fluid className="h-100">
                        <Row className="h-100">
                            <SideNavbar currentUrl={currentUrl} logout={this.logout}/>
                            <NewAd/>
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


