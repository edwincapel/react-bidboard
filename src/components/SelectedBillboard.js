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
        startDate: (new Date(new Date().getTime() +86400000 *8)),
        selected_campaign: null,
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
                console.log(data.all_ads);
                    let price = this.props.selected.base_price
                    let maxBid
                    let newBid
                    if (this.props.selected.bids[0]) {
                        let bidAmounts = []
                        this.props.selected.bids.forEach(bid =>{
                            if (parseInt(bid.booking_at)  ===  parseInt(this.state.startDate.getTime()/1000))  {
                                bidAmounts.push(bid.amount)
                            maxBid = Math.max(...bidAmounts)
                            newBid = Math.max(...bidAmounts) * 1.1
                            debugger
                            }
                        })
                    }
                else if ((this.state.startDate.getHours() >= 7 && this.state.startDate.getHours() <= 9) || (this.state.startDate.getHours() >= 16 && this.state.startDate.getHours() <= 21)) {
                    price = price * 1.25
                }

                this.setState(
                    {
                        medium: data.all_ads,
                        selected_campaign: data.all_ads[0],
                        total: parseInt(price),
                        maxBid: maxBid,
                        newBid: parseInt(newBid)
                    })

            })
            .catch(error => {
                console.log('ERROR: ', error);
            })
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.selected != this.props.selected) {
            let price = this.props.selected.base_price
            let maxBid
            let newBid
            if (this.props.selected.bids[0]) {
                let bidAmounts = []
                this.props.selected.bids.forEach(bid =>{
                    if (parseInt(bid.booking_at)  ===  parseInt(this.state.startDate.getTime()/1000))  {
                        bidAmounts.push(bid.amount)
                    maxBid = Math.max(...bidAmounts)
                    newBid = Math.max(...bidAmounts) * 1.1
                    debugger
                    }
                })
            }
            else if ((this.state.startDate.getHours() >= 7 && this.state.startDate.getHours() <= 9) || (this.state.startDate.getHours() >= 16 && this.state.startDate.getHours() <= 21)) {
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
        const {total,newBid} = this.state
        const nonce = await this.instance.requestPaymentMethod()
        
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/bids/new_bid',
            headers: {
                "Content-Type": 'application/json'
            },
            data: {
                user_id: this.state.currentUser.id,
                amount: this.payment(),
                nonce: nonce.nonce,
                billboard_id: this.props.selected.id,
                medium_id: this.state.selected_campaign.id,
                booking_at: (((this.state.startDate).getTime())/1000),
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
        let maxBid
        let newBid
        if (this.props.selected.bids[0]) {
            let bidAmounts = []
            this.props.selected.bids.forEach(bid =>{
                if (parseInt(bid.booking_at)  ===  parseInt(this.state.startDate.getTime()/1000))  {
                    bidAmounts.push(bid.amount)
                maxBid = Math.max(...bidAmounts)
                newBid = Math.max(...bidAmounts) * 1.1
                debugger
                }
            })
        }
        else if ((date.getHours() >= 7 && date.getHours() <= 9) || (date.getHours() >= 16 && date.getHours() <= 21)) {
            price = price * 1.25
        }
        console.log(date.getTime())
        this.setState({
            startDate: date,
            total: parseInt(price),
            maxBid: maxBid,
            newBid: parseInt(newBid)
        });
    }
    handleCampaign = (e) => {
        const obj = (this.state.medium).find(o => o.campaign_name === e.target.value)
        this.setState({ selected_campaign: obj })
        console.log(obj);
        
    }

    // checkBids = () => {
    //     let bidAmounts=[]
    //     if (this.props.selected.bids[0]) {
    //         this.props.selected.bids.forEach(bid =>{
                // if (parseInt(bid.booking_at)  ===  parseInt(this.state.startDate.getTime()/1000))  {
    //                 bidAmounts.push(bid.amount)
    //                 console.log(bid.amount)
                    
    //             }
    //             let maxBid = Math.max(...bidAmounts) * 1.1
    //             return maxBid
    //         })
    //     }
    // }
    render() {
        const { selected, handleSelected } = this.props
        const { medium, total, maxBid, newBid } = this.state
        if (selected.bids[0]) { console.log(selected.bids[0].amount) }
        // const maxBid = this.checkBids()
        console.log(maxBid)

        if (!medium) return <h1>Wait lah</h1>
        return (
            <>
                <div className="w-100 h-100 border-bottom p-0 active d-flex justify-content-center align-items-center" onClick={handleSelected}>

                    <Form className="w-75 p-3" onSubmit={this.handleSubmit}>
                        <FormGroup>
                        <h4>{selected.location}</h4>
                            <Label for="exampleSelect">Choose Campaign</Label>
                            <Input type="select" name="select" id="exampleSelect" onChange={this.handleCampaign}>
                                {
                                    medium.map((item, i) => (
                                        <option key={i}>{item.campaign_name}</option>
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
                                dateFormat="MMMM d, yyyy h aa"
                            />
                            <div className="w-100 d-flex mt-3 border-top border-bottom p-3">
                                <p className="mr-auto">Rate for this hour</p>
                                <p className="ml-auto">{this.payment()} MYR</p>
                            </div>
                            <div className="w-100 d-flex mt-3 border-top border-bottom p-3">
                                <p className="mr-auto">Highest Bid</p>
                                {
                                    maxBid ? 
                                        <p className="ml-auto">{maxBid} MYR</p> : 'This is the first bid!'
                                }
                            </div>
                            <br />
                            {
                                maxBid ? <Alert color="info">A bid already exists for this billboard and time slot. Please bid a higher booking fee or choose a different billboard/time slot</Alert> : ""
                            }
                            <div className="d-flex flex-row mt-3 ml-1 w-100">
                                <Button className="btn btn-dark ml-auto" onClick={this.toggle}>
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
