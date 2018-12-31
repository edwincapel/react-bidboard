import React from 'react';
import {Col} from 'reactstrap'
import SmallCard from './SmallCard';

const top = {
    height:'425px'
}

const Dashboard = () => (
    <Col md="10" className="ml-sm-auto p-0">
        <div className="d-flex justify-content-between flex-wrap">
            <div className="w-100 bg-gradient-primary d-flex justify-content-center align-items-center p-5" style={top} >
                <SmallCard title="Active Campaigns" number="3"/>
                <SmallCard title="Approved Campaigns" number="2"/>
                <SmallCard title="Eyeballs" number="1000"/>
            </div>
            <div className="w-100 bottom-bg p-5">
            </div>
        </div>
    </Col>
)
export default Dashboard



