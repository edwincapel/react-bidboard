import React from 'react';
import {Col} from 'reactstrap'
import SmallCard from './SmallCard';
import { RadialChart } from 'react-vis';

const top = {
    height:'425px'
}

const Dashboard = ({medium,approved,rejected,myData}) => (
    <Col md="10" className="ml-sm-auto p-0">
        <div className="d-flex justify-content-between flex-wrap">
            <div className="w-100 bg-gradient-primary d-flex justify-content-center align-items-center p-5" style={top} >
                <SmallCard color={true} title="Campaign Applications" number={medium.length}/>
                <SmallCard color={true} title="Approved Campaigns" number={approved.length}/>
                <SmallCard color={false} title="Rejected Campaigns" number={rejected.length}/>
            </div>
            <div className="w-100 bottom-bg p-5">
            <RadialChart
                data={myData}
                width={300}
                height={300}
                padAngle={0.05}
                labelsAboveChildren={true}
                showLabels
            />
            </div>
        </div>
    </Col>
)
export default Dashboard



