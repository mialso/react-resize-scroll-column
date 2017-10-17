import React from 'react';
import { Item, BalancerItem } from './Item';

import './Column.css';

export default function Column({ data, height }) {
    const items = typeof data.getItemsCount === 'function' && data.getItemsCount();
    if (items < 2) return null;
    return (
        <div className="Column" style={{ height }}>
            <BalancerItem data={data.balancer.top} type="top"/>
            { data.main.map((item, index) => <Item key={index} data={item} />) }
            <BalancerItem data={data.balancer.bottom} type="bottom"/>
        </div>
    );
}
