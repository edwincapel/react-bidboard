import React, {Component} from 'react'
import {Container,Row} from 'reactstrap'
import SideNavbar from '../components/SideNavbar'
import Dashboard from '../components/Dashboard';
import {Redirect} from 'react-router-dom'
import axios from 'axios';

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            medium: [],
            currentUrl: this.props.match.path
        }
    }

    logout = (e) => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('currentUser')
        this.forceUpdate()
    }

    componentDidMount = () => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/api/v1/media/me',
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.jwt}`
            }
        })
            .then(({ data }) => {
                console.log(data.all_ads);
                this.setState(
                    {
                        medium: data.all_ads,
                    })

            })
            .catch(error => {
                console.log('ERROR: ', error);
            })
    }

    render(){  

        const {medium,currentUrl} = this.state
        let approved = medium.filter((item) => {
            if (item.is_approved == true) {
                return item
            }
        });

        let rejected = medium.filter((item) => {
            if (item.is_approved == false) {
                return item
            }
        });
        
        let result = []

        console.log(approved)
        if (approved.length) {
                const { general } = approved[approved.length - 1].concepts
                result = Object.keys(general).map(key => ({'angle': general[key],'label':`${key}`, innerRadius: 0.7}))
                console.log(result)

        }
    
        
        
        if (localStorage.getItem('jwt') ) {
            return(    
                // Dashboard SECTION
                <section className="h-100" id="dashboard"> 
                    <Container fluid>
                        <Row>
                            <SideNavbar currentUrl={currentUrl} logout={this.logout}/>
                            <Dashboard myData={result} medium={medium} approved={approved} rejected={rejected} />
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


