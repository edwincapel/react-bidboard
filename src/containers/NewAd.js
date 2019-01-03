import React from 'react'
import axios from 'axios'
import {Col} from 'reactstrap'
import DropFile from '../components/DropFile';

export default class NewAd extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render(){
        
        return(
            <Col md="10" className="ml-sm-auto p-0">
                <div className="d-flex h-100 justify-content-between flex-wrap">
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <DropFile/>
                    </div>
                </div>
            </Col>
        )
    }
}


