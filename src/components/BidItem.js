import React from 'react';

const BidItem = ({billboard,handleSelected}) => (
    <div className="w-100 border-bottom p-4" onClick={()=>handleSelected(billboard)}>
        <p>Location: {billboard.location}</p>
        <p>Size: {billboard.size}</p>
    </div>
)
export default BidItem
