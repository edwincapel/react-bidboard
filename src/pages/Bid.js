import React, { Component, Fragment } from 'react'
import { Container, Row, Col } from 'reactstrap'
import SideNavbar from '../components/SideNavbar'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import BidItem from '../components/BidItem';
import Loader from '../images/loader.gif'
import SelectedBillboard from '../components/SelectedBillboard';

const fixed = {
    overflowY: 'scroll',
    height: '100vh'
}

export default class Bid extends Component {

    constructor(props) {
        super(props)
        this.state = {
            billboards: null,
            selected: null,
        }
    }

    logout = (e) => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('currentUser')
        this.forceUpdate()
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/v1/billboards/')
            .then(({ data }) => {
                console.log(data.all_billboards);

                this.setState(
                    {
                        billboards: data.all_billboards,
                        selected: data.all_billboards[0]
                    })

            })
            .catch(error => {
                console.log('ERROR: ', error);
            })
    }

    handleSelected = (billboard) => {
        console.log(billboard);
        
        this.setState({
            selected: billboard
        })
    }

    render() {
        const { billboards, selected } = this.state

        if (localStorage.getItem('jwt')) {
            if (billboards !== null) {
                return (
                    // Dashboard SECTION
                    <section className="h-100" id="dashboard">
                        <Container fluid className="h-100">
                            <Row className="h-100">
                                <SideNavbar logout={this.logout} />
                                <Col md={{ size: 4, offset: 2 }} className="bil-list p-2" style={fixed}>
                                    {
                                        billboards.map((item, i) => (
                                            <BidItem key={i} billboard={item} handleSelected={this.handleSelected} />
                                        ))
                                    }
                                </Col>
                                <Col md="6" className="w-100 h-100 p-0">
                                    <SelectedBillboard selected={selected} />
                                </Col>

                            </Row>
                        </Container>
                    </section>
                )
            } else {
                return (
                    <Fragment>
                        <div id="loading" className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                            <img src={Loader} alt="" />
                        </div>
                    </Fragment>
                )
            }
        }
        else {
            return <Redirect to='/login' />;
        }

    }
}


