import React from 'react';
import {Card,CardTitle,CardText} from 'reactstrap'

const card = {
    width: "15rem"
}


const SmallCard = ({title,number,color}) => (
    <Card body className={`m-2 d-inline-block`}>
        <CardTitle>{title}</CardTitle>
        <CardText className={`${color ? 'text-success' : 'text-danger'}`}>{number}</CardText>
    </Card>
)
export default SmallCard

