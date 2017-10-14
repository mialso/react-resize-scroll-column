import React from 'react';
import Item from './Item';

import './Column.css';

export default function Column({ data }) {
    if (!data.itemsCount) return null;
    return (
        <div className="Column">
            <Item data={data.buffer.top} noVisibility />
            <Item data={data.topBal} />
            { data.main.map((item, index) => <Item key={index} data={item} />) }
            <Item data={data.bottomBal} />
            <Item data={data.buffer.bottom} noVisibility />
        </div>
    );
}
