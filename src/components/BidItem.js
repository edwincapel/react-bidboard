import React from 'react';

const BidItem = ({billboard,handleSelected}) => (
    <div className="w-100 border-bottom p-0" onClick={()=>handleSelected(billboard)}>
        <p>{billboard.owner}</p>
        <p>{billboard.id}</p>
    </div>
)
export default BidItem
