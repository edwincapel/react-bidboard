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
            
          this.setState(
            {
                medium: data.all_ads,
                selected_campaign: data.all_ads[0]
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
                date: this.state.startDate
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
        this.setState({
          startDate: date
        });
    }

    handleCampaign = (e) => {
        const obj = (this.state.medium).find(o => o.campaign_name === e.target.value)
        this.setState({selected_campaign: obj})
    }


    render(){
        const {selected,handleSelected} = this.props
        const {medium} = this.state
        
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
