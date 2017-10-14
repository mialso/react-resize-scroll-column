import React from 'react';

import './Item.css';

export default function Item({ data, noVisibility, addStyle }) {
    const height = data.viewArea ? data.viewArea : data.size;
    const style = Object.assign(
        {
            height,
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
