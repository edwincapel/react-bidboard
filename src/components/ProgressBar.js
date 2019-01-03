import React from 'react';
import {Progress} from 'reactstrap'

const ProgressBar = ({a,b}) => (

    <div className="progress">
        <Progress now={50} />
    </div>
)
export default ProgressBar
