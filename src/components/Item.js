import React from 'react';
import { COLUMN_PAD } from '../constants/grid';

import './Item.css';

export default function Item({ data, noVisibility, addStyle }) {
    const style = Object.assign(
        {
            height: data.getSize(),
            display: noVisibility ? 'none' : undefined,
        },
        addStyle,
    );
    return (
        <div className="Item" style={style}>
            n: { data.data.text }
            <p>s: {data.size} -> vA: {data.viewArea}</p>
        </div>
    );
}
