import React from 'react';
import Item from './Item';

import './Column.css';

export default function Column({ data }) {
    if (!data.itemsCount) return null;
    return (
        <div className="Column">
            <Item data={data.topBuf} noVisibility />
            <Item data={data.topBalancer} />
            { data.main.map((item, index) => <Item key={index} data={item} />) }
            <Item data={data.botBalancer} />
            <Item data={data.botBuf} noVisibility />
        </div>
    );
}
