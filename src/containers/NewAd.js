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
                <div className="d-flex justify-content-between flex-wrap">
                    <div className="w-100 d-flex justify-content-center align-items-center p-5">
                        <h1>Upload New Media</h1>
                        {/* if no files or files dropped render dropfile Component */}
                        <DropFile/>
                        {/* else render file preview and also ad description textarea 
                        and axio for POST request submission */}
                    </div>
                </div>
            </Col>
        )
    }
}


