import React from 'react';

import './Item.css';

export default function Item({ data, noVisibility }) {
    const height = data.viewArea ? data.viewArea : data.size;
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
