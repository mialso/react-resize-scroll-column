import React from 'react';
import Item from './Item';

import './Column.css';

export default function Column({ data }) {
    const items = typeof data.getItemsCount === 'function' && data.getItemsCount();
    if (!items) return null;
    return (
        <div className="Column">
            <Item data={data.buffer.top} noVisibility />
            <Item data={data.balancer.top} addStyle={{marginTop: data.balancer.top.getMargin()}} />
            { data.main.map((item, index) => <Item key={index} data={item} />) }
            <Item data={data.balancer.bottom} addStyle={{marginBottom: data.balancer.bottom.getMargin()}} />
            <Item data={data.buffer.bottom} noVisibility />
        </div>
    );
}
