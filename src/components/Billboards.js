import React,{Component} from 'react';
import {Container,Row} from 'reactstrap'
import SideNavbar from '../components/SideNavbar'
import {Redirect} from 'react-router-dom'
import Axios from 'axios';
import moment from 'moment'

export default class Billboards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            billboards:[],
            time:`${moment(Date.now()).format("LT")}`,
            price:''
        }
    }

    componentDidMount = () =>{
        Axios.get('http://localhost:5000/api/v1/billboards')
        .then(response =>{
            this.setState({billboards:response.data.all_billboards})
        })
        .catch(error =>{
            console.log(error)
        })
    }

    onClickHandler = (e) =>{
        this.setState({time:moment(Date.now()).format("LT")})
    }

  render(){
      console.log(this.state.time)
        if (localStorage.getItem('jwt')) {
            return(
                <div>
                <section className="h-100" id="dashboard"> 
                    <Container fluid className="h-100">
                        <Row className="h-100">
                            <SideNavbar/>
                        </Row>
                    </Container>
                </section>
                <section id='billboardcontainer'>
                
                {
                    this.state.billboards.map((billboard,index)=>
                    <div onClick={this.onClickHandler} className='billboard' id={index} key={index}>
                        <small>
                        Location : {billboard.location} <br/>
                        Price : 
                        {this.state.time[5] === 'A' && this.state.time[0] >= 7 && this.state.time[0] <= 9 ||
                        this.state.time[5] === 'P' && this.state.time[0] >= 4 && this.state.time[0] <= 7
                        ?  billboard.base_price * 1.25 
                        : billboard.base_price
                        }
                        </small>
                        <hr/>
                        
                    </div>
                    )
                }
                
                
                </section>
                </div>
            )
        }
        else{
            return <Redirect to='/login'/>;
        }
    }
}
  
