import React from 'react';
import { COLUMN_PAD } from '../constants/grid';

import './Item.css';

export default function Item({ data, noVisibility }) {
    const height = data.viewArea !== 'max' ? data.viewArea : data.size - COLUMN_PAD;
    const style = {
        height,
        display: noVisibility ? 'none' : undefined,
    };
    return (
        <div className="Item" style={style}>
            n: { data.data.text }
            <p>s: {data.size} -> vA: {data.viewArea}</p>
        </div>
    );
}
