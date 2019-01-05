import React from 'react';

const BidItem = ({billboard, handleSelected, selected}) => (
    <div className={`w-100 border-bottom bidItem p-4 ${billboard.id == selected.id ? 'bg-bidItem' : ''}`} onClick={()=>handleSelected(billboard)}>
        <p>Location: {billboard.location}</p>
        <p>Size: {billboard.size}</p>
    </div>
)
export default BidItem
