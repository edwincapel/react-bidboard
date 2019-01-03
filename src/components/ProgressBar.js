import React from 'react';
import {Progress} from 'reactstrap'

const ProgressBar = ({item}) => (
    <div className="w-100 p-3">
        <div className="text-center">{item[0]},{Math.round(item[1]*100)} %</div>
        <Progress value={item[1]*100} />
    </div>
)
export default ProgressBar
