import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import axios from 'axios';
import DatePicker from 'react-datepicker'
import { setMinutes, setHours } from 'date-fns'
import DropIn from "braintree-web-drop-in-react";


//user_id
//amount
//billboard id
//medium id
//date

export default class SelectedBillboard extends Component {
    instance;

    state = {
        isLoading: false,
        currentUser: JSON.parse(localStorage.getItem('currentUser')),
        amount: null,
        medium: null,
        total: null,
        startDate: new Date(),
        selected_campaign: null,
        modal: false
    }

    componentDidMount = () => {
        this.generate_client_token()
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
                let price = this.props.selected.base_price
                if ((this.state.startDate.getHours() >= 7 && this.state.startDate.getHours() <= 9) || (this.state.startDate.getHours() >= 16 && this.state.startDate.getHours() <= 21)) {
                    price = price * 1.25
                }

                this.setState(
                    {
                        medium: data.all_ads,
                        selected_campaign: data.all_ads[0],
                        total: price
                    })

            })
            .catch(error => {
                console.log('ERROR: ', error);
            })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });

    }

    generate_client_token = () => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/api/v1/bids/new_token',

        })
            .then(response => {
                console.log(response)
                this.setState({
                    clientToken: response.data
                })
            })
            .catch(error => {
                console.log(error);
            })
    };


    submit_bid = async () => {
        const nonce = await this.instance.requestPaymentMethod()
        console.log(nonce.nonce)
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/bids/new_bid',
            headers: {
                "Content-Type": 'application/json'
            },
            data: {
                user_id: this.state.currentUser.id,
                amount: this.state.total,
                nonce: nonce.nonce,
                billboard_id: this.props.selected.id,
                medium_id: this.state.selected_campaign.id,
                booking_at: (((this.state.startDate).getTime()) / 1000),
            }
        })

            .then(response => {
                console.log(response)
                setTimeout(() =>
                    this.setState({
                        modal: false
                    }), 2000)
            })
            .catch(error => {
                console.log(error);
            });
    }


    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({

        })

    }

    handleChange = (date) => {
        let price = this.props.selected.base_price
        if ((date.getHours() >= 7 && date.getHours() <= 9) || (date.getHours() >= 16 && date.getHours() <= 21)) {
            price = price * 1.25
        }
        this.setState({
            startDate: date,
            total: price
        });
    }

    handleCampaign = (e) => {
        const obj = (this.state.medium).find(o => o.campaign_name === e.target.value)
        this.setState({ selected_campaign: obj })
    }


    render() {
        const { selected, handleSelected } = this.props
        const { medium, total } = this.state

        if (!medium) return <h1>Wait lah</h1>
        return (
            <>
                <div className="w-100 h-100 border-bottom p-0" onClick={handleSelected}>
                    <p>{selected.owner}</p>
                    <p>{selected.id}</p>

                    <Form className="w-100 p-5" onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="exampleSelect">Choose Campaign</Label>
                            <Input type="select" name="select" id="exampleSelect" onChange={this.handleCampaign}>
                                {
                                    medium.map((item, i) => (
                                        <option key={i}>{item.campaign_name}</option>
                                    ))
                                }
                            </Input>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                showTimeSelect
                                timeFormat="HH:mm"
                                injectTimes={[
                                    setHours(setMinutes(new Date(), 1), 0),
                                    setHours(setMinutes(new Date(), 5), 12),
                                    setHours(setMinutes(new Date(), 59), 23)
                                ]}
                                dateFormat="MMMM d, yyyy h:mm aa"
                            />
                            <p>Rate for this hour</p>
                            <p>MYR {total}</p>

                            <div className="d-flex flex-row mt-3 ml-1">
                                <Button className="btn btn-dark" onClick={this.toggle}>
                                    Place Bid
                            </Button>
                            </div>
                        </FormGroup>
                    </Form>
                </div>
                {/* // payment modal */}
                <Col md="10" className="ml-sm-auto p-0">
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Enter your payment details</ModalHeader>
                        <ModalBody>
                            <Label>Bid Payment {this.state.total} MYR</Label>
                            <div>
                                <DropIn
                                    options={{ authorization: this.state.clientToken }}
                                    onInstance={instance => (this.instance = instance)}
                                />
                            </div>
                            <div style={{ 'float': 'right' }}>
                                <Button color="primary" onClick={this.submit_bid}>Place Bid</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div><small> You are one step away from completing your bid! No funds will be deducted until the bid closes with you as the highest bidder.</small></div>
                        </ModalFooter>
                    </Modal>

                </Col>
            </>
        )
    }
}
