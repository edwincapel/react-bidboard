import React,{Component} from 'react';
import {Button,Form,FormGroup,Input,Label} from 'reactstrap'
import axios from 'axios';
import DatePicker from 'react-datepicker'
import { setMinutes,setHours } from 'date-fns'

//user_id
//amount
//billboard id
//medium id
//date

export default class SelectedBillboard extends Component {
    constructor() {
        super()
        this.state = {
            isLoading: false,
            currentUser: JSON.parse(localStorage.getItem('currentUser')),
            amount: null,
            medium:null,
            total:null,
            startDate: new Date(),
            selected_campaign: null,
        }
      }

    componentDidMount(){
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/api/v1/media/me',
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.jwt}`
            }
          })
        .then(({data}) => {
            console.log(data.all_ads);
            let price = this.props.selected.base_price
            if ((this.state.startDate.getHours() >= 7 && this.state.startDate.getHours()<= 9)||(this.state.startDate.getHours() >= 16 && this.state.startDate.getHours()<= 21)) {
                price = price *1.25
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

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            isLoading:true
        })

        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/bids/new_token',
            headers: {
                'content-type': 'application/json',
            },
            data: {
                user_id: this.state.currentUser.id,
                billboard_id: this.props.selected.id,
                campaign_id: this.state.selected_campaign.id,
                date: (((this.state.startDate).getTime())/1000)
            }
          })
        .then( response => {
            console.log(response)
            if(response.status === 201){
                console.log("success");
                this.setState({

                })
            }
        })
        .catch(error => {
            console.log(error);
        }); 
    }

    handleChange = (date) => {
        let price = this.props.selected.base_price
        if ((date.getHours() >= 7 && date.getHours()<= 9)||(date.getHours() >= 16 && date.getHours()<= 21)) {
            price = price *1.25
        }
        this.setState({
          startDate: date,
          total: price
        });
    }

    handleCampaign = (e) => {
        const obj = (this.state.medium).find(o => o.campaign_name === e.target.value)
        this.setState({selected_campaign: obj})
    }


    render(){
        const {selected,handleSelected} = this.props
        const {medium,total} = this.state
        
        if (!medium) return <h1>Wait lah</h1>
        return(
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
                            <Button className="btn btn-dark" value="Submit">
                                Place Bid
                            </Button>
                        </div>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}
