import React, { Component } from 'react';
import { Alert, Button, Form, FormGroup, Input, Label, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
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
        startDate: (new Date((new Date().getTime() +86400000 *8) - (new Date().getMinutes()*60000) - (new Date().getSeconds()*1000))),
        selected_campaign: null,
        selected_campaign_error: false,
        modal: false,
        maxBid: 0,
        newBid: 0
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
                const {startDate} = this.state
            let price = this.props.selected.base_price
            let maxBid
            let newBid
            if (this.props.selected.bids[0]) {
                let bidAmounts = []
                this.props.selected.bids.forEach(bid =>{
                    if (parseInt(bid.booking_at)  ==  parseInt(startDate.getTime()/1000))  {
                        bidAmounts.push(bid.amount)
                    }
                })
                maxBid = Math.max(...bidAmounts)
                newBid = Math.max(...bidAmounts) * 1.1
            }
            
            if ((this.state.startDate.getHours() >= 7 && this.state.startDate.getHours() <= 9) || (this.state.startDate.getHours() >= 16 && this.state.startDate.getHours() <= 21)) {
                    price = price * 1.25
                }

                this.setState(
                    {
                        medium: data.all_ads,
                        selected_campaign: [],
                        total: parseInt(price),
                        maxBid: maxBid,
                        newBid: parseInt(newBid)
                    })

            })
            .catch(error => {
                console.log('ERROR: ', error);
            })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.selected != this.props.selected || prevState.startDate != this.state.startDate) {
            const {startDate} = this.state
            let price = this.props.selected.base_price
            let maxBid
            let newBid
            if (this.props.selected.bids[0]) {
                let bidAmounts = []
                this.props.selected.bids.forEach(bid =>{
                    if (parseInt(bid.booking_at)  ==  parseInt(startDate.getTime()/1000))  {
                        bidAmounts.push(bid.amount)
                    }
            })
            if (bidAmounts[0]){
            maxBid = Math.max(...bidAmounts)
            newBid = Math.max(...bidAmounts) * 1.1
            }
        }
        
        if ((this.state.startDate.getHours() >= 7 && this.state.startDate.getHours() <= 9) || (this.state.startDate.getHours() >= 16 && this.state.startDate.getHours() <= 21)) {
                price = price * 1.25
                
            }
    
            this.setState(
                {
                    total: parseInt(price),
                    maxBid: maxBid,
                    newBid: parseInt(newBid)
                })
        }

    }

    toggle = () => {
        if (this.state.selected_campaign.id) {
            this.setState({
                modal: !this.state.modal
            });
        }
        else {
            this.setState({
                selected_campaign_error: true
            })
        }
    }

    generate_client_token = () => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/api/v1/bids/new_token',

        })
            .then(response => {
                this.setState({
                    clientToken: response.data
                })
            })
            .catch(error => {
                console.log(error);
            })
    };
    payment = () => {
        const {total,newBid} = this.state

        if (newBid > total) {
            return newBid 
        } else {
            return total
       }
    }

    submit_bid = async () => {
        const nonce = await this.instance.requestPaymentMethod()
        const payment = this.payment()
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/bids/new_bid',
            headers: {
                "Content-Type": 'application/json'
            },
            data: {
                user_id: this.state.currentUser.id,
                amount: payment,
                nonce: nonce.nonce,
                billboard_id: this.props.selected.id,
                medium_id: this.state.selected_campaign.id,
                booking_at: this.state.startDate.getTime()/1000,
            }
        })

            .then(response => {
                setTimeout(() =>
                    this.setState({
                        modal: false,
                        maxBid: payment,
                        newBid: parseInt(payment * 1.1)
                    }), 500)
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
        this.props.updateParent()
        this.setState({
            startDate: date,
        });
    }
    handleCampaign = (e) => {
        const obj = (this.state.medium).find(o => o.campaign_name === e.target.value)
        if (obj) { 
            this.setState({ selected_campaign: obj, selected_campaign_error: false })
        }
    }

    render() {
        const { selected, handleSelected } = this.props
        const { medium, maxBid,selected_campaign_error } = this.state
        if (!medium) return <h1>Loading...</h1>
        return (
            <>
                <div className="w-100 h-100 border-bottom p-0 active d-flex justify-content-center align-items-center" onClick={handleSelected} >

                    <Form className="w-75 p-3" onSubmit={this.handleSubmit} style={{overflowY:'auto', height:'100vh'}}>
                        <FormGroup>
                        <h4>{selected.location}</h4>
                            <Label for="exampleSelect">Choose Campaign</Label>
                            <Input type="select" name="select" id="exampleSelect" onChange={this.handleCampaign}>
                                <option>Select a campaign</option>
                                {
                                    medium.map((item, i) => (
                                        item.is_approved ? <option key={i}>{item.campaign_name}</option> : null
                                    ))
                                }
                            </Input>
                            <div className="w-100 mt-3 mb-3">
                                <img src={this.state.selected_campaign.medium_url} className="w-100" alt="" />
                            </div>
                            <Label for="datepicker">Select Date</Label>
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
                            {
                                (new Date().getTime() + 86400000 * 7) > this.state.startDate.getTime() ? <hr /> :<>
                            <div className="w-100 d-flex mt-3 border-top border-bottom p-3">
                                <p className="mr-auto">Rate for this hour</p>
                                <p className="ml-auto">{this.payment()} MYR</p>
                            </div>
                            <div className="w-100 d-flex mt-3 border-top border-bottom p-3">
                                <p className="mr-auto">Highest Bid</p>
                                {
                                    maxBid > 0 ? 
                                        <p className="ml-auto">{maxBid} MYR</p> : 'This is the first bid!'
                                }
                            </div>
                            </>}
                            {
                                (new Date().getTime() + 86400000 * 7) > this.state.startDate.getTime() ?
                                <Alert color='danger'>The Bidding for this time slot has closed. Please select a time slot that is more than a week away</Alert> 
                                :
                                maxBid > 0 ? <Alert color="info">A bid already exists for this billboard and time slot. Please bid a higher booking fee or choose a different billboard/time slot</Alert> : ""
                            }
                            {
                                (new Date().getTime() + 86400000 * 7) > this.state.startDate.getTime() ? null :
                            <div className="d-flex flex-row mt-3 ml-1 w-100">
                                <Button className="btn btn-dark ml-auto" onClick={this.toggle}>
                                    Place Bid
                            </Button>
                            </div>
                            }
                            {selected_campaign_error ? <small style={{color:"red"}}>Please select a campaign</small>:""}
                        </FormGroup>
                    </Form>
                </div>
                {/* // payment modal */}
                <Col md="10" className="ml-sm-auto p-0">
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Enter your payment details</ModalHeader>
                        <ModalBody>
                            <Label>Bid Payment {this.payment()} MYR</Label>
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
