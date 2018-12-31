import React from 'react';
import {Card,CardTitle,CardText} from 'reactstrap'

const card = {
    width: "15rem"
}
const numberColor = {
    color: 'green'
}

const SmallCard = ({title,number}) => (
    <Card body style={card} className="m-2 d-inline-block">
        <CardTitle>{title}</CardTitle>
        <CardText style={numberColor}>{number}</CardText>
    </Card>
)
export default SmallCard
